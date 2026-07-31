"use client";

import { useEffect, useState, useRef, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Check, X, Shield, Download, Share2, ZoomIn, ZoomOut, Film, ChevronLeft, ChevronRight,
  Camera, QrCode, Smartphone
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MediaItem {
  id: string;
  url: string;
  category: string;
  uploader: string;
  type: string;
  status: string;
  timestamp: string;
}

const albums = ["Pelli Kuthuru", "Haldi", "Reception", "Wedding", "Family Moments"];

export function WeddingGallery() {
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  
  // Upload states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("Family Moments");
  const [uploadingStatus, setUploadingStatus] = useState<{
    current: number;
    total: number;
    progress: number;
  } | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Camera & Scanner states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize URL for QR code
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable. Please upload files instead.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera_scan_${Date.now()}.jpg`, { type: "image/jpeg" });
          setSelectedFiles((prev) => [...prev, file]);
          stopCamera();
        }
      }, "image/jpeg", 0.95);
    }
  };

  // Lightbox states
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Fetch approved gallery
  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (data.gallery) {
          setGallery(data.gallery);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Drag and drop events
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const validateAndAddFiles = (files: FileList | File[]) => {
    const validFiles: File[] = [];
    let errors: string[] = [];

    Array.from(files).forEach((file) => {
      // We just allow the file if it passed the file picker accept criteria
      
      // Limit size to 4.5MB to avoid Vercel server payload 413 errors
      if (file.size > 4.5 * 1024 * 1024) {
        errors.push(`${file.name}: Exceeds the 4.5MB size limit for uploads.`);
        return;
      }

      // Size limit: 30MB
      if (file.size > 30 * 1024 * 1024) {
        errors.push(`${file.name}: Exceeds the 30MB size limit.`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setUploadError(errors.join(" "));
    } else {
      setUploadError("");
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // Form Upload loop
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !uploaderName) {
      setUploadError("Uploader name and at least one file are required.");
      return;
    }

    setUploadError("");
    setUploadSuccess(false);

    const totalFiles = selectedFiles.length;
    for (let i = 0; i < totalFiles; i++) {
      const file = selectedFiles[i];
      setUploadingStatus({ current: i + 1, total: totalFiles, progress: 0 });

      try {
        await new Promise<void>((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("uploader", uploaderName);
          formData.append("category", selectedAlbum);

          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/gallery/upload", true);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadingStatus({ current: i + 1, total: totalFiles, progress: percent });
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve();
            } else {
              reject(new Error(`Failed to upload ${file.name}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error(`Network error during upload of ${file.name}`));
          };

          xhr.send(formData);
        });
      } catch (err: any) {
        setUploadError(err.message || "Failed to upload files. Please try again.");
        setUploadingStatus(null);
        return;
      }
    }

    // Success!
    setUploadSuccess(true);
    setSelectedFiles([]);
    setUploadingStatus(null);
    setUploadError("");
    
    // Refresh the public gallery if some might have been auto-approved
    fetchGallery();

    setTimeout(() => {
      setUploadSuccess(false);
    }, 5000);
  };

  // Filter gallery items
  const filteredGallery = gallery.filter(item => {
    if (activeFilter === "All") return true;
    return item.category === activeFilter;
  });

  // Share link handler
  const handleShare = async (item: MediaItem) => {
    const absoluteUrl = window.location.origin + item.url;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sudeepthi & Nayan's Wedding Memory",
          text: `Check out this wedding moment shared by ${item.uploader}!`,
          url: absoluteUrl
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(absoluteUrl);
      alert("Link copied to clipboard!");
    }
  };

  // Zoom controls
  const zoomIn = () => setZoomScale(prev => Math.min(prev + 0.5, 4));
  const zoomOut = () => {
    setZoomScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  return (
    <section className="py-24 px-4 relative" id="gallery"
      style={{ background: "linear-gradient(160deg, #1c0008 0%, #120005 50%, #1c0008 100%)" }}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-gold-light/60 text-xs uppercase tracking-[0.35em] mb-3">Wedding Memories</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-white mb-4">Celebration Gallery</h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-primary/40" />
            <span className="text-gold-primary text-xl">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-primary/40" />
          </div>

          {/* Quick toggle between Guest View / Upload and Admin login */}
          <div className="flex justify-center gap-4">
            <div className="px-6 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg">
              Guest Zone
            </div>
            <Link
              href="/admin"
              className="px-6 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-widest transition-all bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" /> Host Admin
            </Link>
          </div>
        </div>

        {/* ── GUEST ZONE ── */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Guest Upload Section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="font-calligraphy text-3xl text-gold-light mb-2">Upload Memories</h3>
            <p className="font-serif italic text-white/50 text-xs mb-6">
              Share your favorite wedding photos and videos with the couple. Uploads go into a moderation queue.
            </p>
            <form onSubmit={handleUploadSubmit} className="space-y-4 font-sans">
              {/* Scan Buttons Bar */}
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={isCameraActive ? stopCamera : startCamera}
                  className="flex-1 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-gold-light animate-pulse" />
                  {isCameraActive ? "Close Camera" : "Snap Photo"}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#c8a84b]/20 bg-[#c8a84b]/5 hover:bg-[#c8a84b]/10 text-gold-light font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-gold-light" />
                  Scan to Upload
                </button>
              </div>

              {/* Viewfinder or Drag & Drop Box */}
              {isCameraActive ? (
                <div className="relative border border-gold-primary rounded-2xl overflow-hidden bg-black aspect-[4/3] flex flex-col justify-between shadow-2xl">
                  {cameraError ? (
                    <div className="p-4 text-center text-xs text-rose-400 my-auto">
                      <p className="font-serif italic">{cameraError}</p>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-[10px] uppercase font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border border-white/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="w-12 h-12 rounded-full border-4 border-white bg-red-600 hover:bg-red-700 transition-transform active:scale-95 shadow-lg flex items-center justify-center"
                          title="Capture Photo"
                        >
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? "border-gold-primary bg-gold-primary/10" 
                      : "border-white/20 bg-black/20 hover:border-gold-primary/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold-light border border-white/10">
                      <Upload className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-white/80">Drag & Drop or Tap to Browse</p>
                      <p className="font-sans text-[9px] text-white/30 mt-1">Select one or more images/videos up to 30MB each</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Selected Files Preview List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <p className="font-sans text-[9px] text-white/40 uppercase tracking-wider">Selected Files ({selectedFiles.length})</p>
                  {selectedFiles.map((file, idx) => {
                    const isImg = file.type.startsWith("image/");
                    return (
                      <div key={idx} className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl p-2 gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {isImg ? (
                            <div className="w-8 h-8 rounded bg-gray-800 overflow-hidden relative shrink-0">
                              <img
                                src={URL.createObjectURL(file)}
                                className="object-cover w-full h-full"
                                alt="Preview"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center shrink-0 text-gold-light">
                              <Film className="w-4 h-4" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="font-sans text-xs text-white truncate max-w-[140px]">{file.name}</p>
                            <p className="font-sans text-[9px] text-white/40">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-white/40 hover:text-rose-400 p-1 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Uploader Name */}
              <div>
                <label className="font-sans text-[9px] text-white/40 uppercase tracking-widest block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Guest Name"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold-primary"
                />
              </div>

              {/* Album Category Selector */}
              <div>
                <label className="font-sans text-[9px] text-white/40 uppercase tracking-widest block mb-1">Select Event Album</label>
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-primary font-sans"
                >
                  {albums.map((album) => (
                    <option key={album} value={album} className="bg-[#120005] text-white">{album}</option>
                  ))}
                </select>
              </div>

              {/* Progress bar / Alerts */}
              {uploadingStatus !== null && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-white/60 font-sans">
                    <span>Uploading file {uploadingStatus.current} of {uploadingStatus.total}...</span>
                    <span>{uploadingStatus.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-150"
                      style={{ width: `${uploadingStatus.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadSuccess && (
                <div className="bg-emerald-500/15 border border-emerald-500/35 rounded-xl p-3 text-center text-xs text-emerald-400 flex items-center justify-center gap-2 font-sans">
                  <Check className="w-4 h-4" /> Upload successful! Awaiting moderation.
                </div>
              )}

              {uploadError && (
                <div className="bg-rose-500/15 border border-rose-500/35 rounded-xl p-3 text-center text-xs text-rose-400 font-sans">
                  {uploadError}
                </div>
              )}

              <button
                type="submit"
                disabled={selectedFiles.length === 0 || !uploaderName || uploadingStatus !== null}
                className={`w-full py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest transition-all ${
                  selectedFiles.length > 0 && uploaderName && uploadingStatus === null
                    ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg hover:scale-[1.02]"
                    : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                }`}
              >
                {uploadingStatus ? `Uploading ${uploadingStatus.current}/${uploadingStatus.total}...` : "Submit to Gallery"}
              </button>
            </form>
          </div>

          {/* Approved Masonry Gallery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              {["All", ...albums].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-widest border transition-all ${
                    activeFilter === filter
                      ? "bg-white text-deep-maroon border-white shadow-md shadow-white/10"
                      : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Masonry layout column layout */}
            {filteredGallery.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <p className="font-serif italic text-white/40 text-sm">No approved photos in this album yet.</p>
              </div>
            ) : (
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {filteredGallery.map((item, idx) => {
                  const actualIdx = gallery.findIndex(g => g.id === item.id);
                  
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => {
                        setLightboxIndex(actualIdx);
                        setZoomScale(1);
                        setPanOffset({ x: 0, y: 0 });
                      }}
                      className="relative group rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-black/40 break-inside-avoid shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.type === "video" ? (
                        <div className="relative aspect-[3/4]">
                          <video src={item.url} className="object-cover w-full h-full" muted />
                          <div className="absolute top-3 right-3 bg-black/60 w-8 h-8 rounded-full flex items-center justify-center text-white border border-white/10">
                            <Film className="w-4 h-4" />
                          </div>
                        </div>
                      ) : item.type === "document" ? (
                        <div className="relative aspect-[3/4] bg-black/60 flex flex-col items-center justify-center p-4">
                          <Download className="w-8 h-8 text-gold-light mb-2" />
                          <p className="text-white text-xs text-center break-all">{item.url.split('/').pop()}</p>
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt={`Photo by ${item.uploader}`}
                          width={350}
                          height={450}
                          className="w-full h-auto object-cover"
                          sizes="(max-width: 768px) 150px, 300px"
                        />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="font-sans text-[9px] text-gold-light uppercase tracking-widest">{item.category}</p>
                        <p className="font-calligraphy text-2xl text-white leading-tight">By {item.uploader}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ── LIGHTBOX VIEWER ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between py-6 px-4 select-none touch-none"
          >
            {/* Top Toolbar */}
            <div className="relative z-10 flex justify-between items-center max-w-5xl mx-auto w-full">
              <div>
                <p className="font-sans text-[10px] text-gold-light uppercase tracking-widest">
                  {gallery[lightboxIndex]?.category}
                </p>
                <p className="font-calligraphy text-2xl text-white">
                  By {gallery[lightboxIndex]?.uploader}
                </p>
              </div>

              {/* Close and Actions */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={zoomIn} 
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={zoomOut}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <a
                  href={gallery[lightboxIndex]?.url}
                  download={`wedding_${gallery[lightboxIndex]?.id}`}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleShare(gallery[lightboxIndex])}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 rounded-full bg-gold-primary text-deep-maroon flex items-center justify-center font-bold shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Canvas */}
            <div 
              className="flex-1 flex items-center justify-center relative w-full overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {lightboxIndex > 0 && (
                <button
                  onClick={() => { 
                    setLightboxIndex(lightboxIndex - 1); 
                    setZoomScale(1); 
                    setPanOffset({ x: 0, y: 0 }); 
                  }}
                  className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Media Element with Zoom and Pan styling */}
              <div 
                className="relative max-w-4xl max-h-[70vh] aspect-auto w-full h-full flex items-center justify-center transition-transform duration-100 ease-out cursor-grab active:cursor-grabbing"
                style={{
                  transform: `scale(${zoomScale}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
              >
                {gallery[lightboxIndex]?.type === "video" ? (
                  <video
                    src={gallery[lightboxIndex]?.url}
                    className="max-w-full max-h-full object-contain rounded-xl"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : gallery[lightboxIndex]?.type === "document" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 rounded-xl p-8">
                    <Download className="w-16 h-16 text-gold-light mb-4" />
                    <p className="text-white text-lg text-center mb-4">{gallery[lightboxIndex]?.url.split('/').pop()}</p>
                    <a href={gallery[lightboxIndex]?.url} download className="px-6 py-2 bg-gold-primary text-deep-maroon rounded-full font-bold">Download Document</a>
                  </div>
                ) : (
                  <Image
                    src={gallery[lightboxIndex]?.url}
                    alt="Enlarged view"
                    fill
                    className="object-contain rounded-xl"
                    sizes="100vw"
                  />
                )}
              </div>

              {lightboxIndex < gallery.length - 1 && (
                <button
                  onClick={() => { 
                    setLightboxIndex(lightboxIndex + 1); 
                    setZoomScale(1); 
                    setPanOffset({ x: 0, y: 0 }); 
                  }}
                  className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom info indicator */}
            <div className="text-center font-sans text-white/40 text-xs select-none">
              Photo {lightboxIndex + 1} of {gallery.length} · Double-touch to pan if zoomed
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── QR CODE SHARE MODAL ── */}
      <AnimatePresence>
        {isQrModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-sm w-full p-px rounded-3xl"
              style={{ background: "linear-gradient(135deg, #b8860b, #ffd700, #4a0404, #ffd700, #b8860b)" }}
            >
              <div className="bg-[#120005] rounded-3xl p-6 md:p-8 text-center space-y-5 relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <p className="font-sans text-gold-light/60 text-[9px] uppercase tracking-[0.3em] font-bold">Mobile Upload Scanner</p>
                  <h3 className="font-calligraphy text-3xl text-white">Scan &amp; Share Photos</h3>
                  <p className="font-serif italic text-white/50 text-[11px] max-w-[240px] mx-auto leading-relaxed">
                    Point your mobile camera at this code to open the invitation and instantly upload your wedding snaps!
                  </p>
                </div>

                {/* QR Image Frame */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border border-gold-primary/20">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`}
                    alt="Scan to share wedding uploads"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="flex items-center justify-center gap-2 text-gold-light text-xs font-sans">
                  <Smartphone className="w-4 h-4 animate-bounce" />
                  <span>Works on iOS &amp; Android</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
