import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, RotateCcw } from 'lucide-react'

/**
 * ImageCropModalProps defines the properties required by ImageCropModal.
 */
export interface ImageCropModalProps {
  imageSrc: string
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedDataUrl: string) => void
}

const CONTAINER_SIZE = 280
const CROP_MASK_SIZE = 240

/**
 * ImageCropModal provides an interactive photo editing modal with zoom, drag-to-position, rotation, and circular avatar cropping.
 *
 * @param props - Modal properties including source image URI and completion callback.
 * @returns JSX Element rendering the photo editor modal.
 */
export function ImageCropModal(props: ImageCropModalProps): React.JSX.Element | null {
  const { imageSrc, isOpen, onClose, onCropComplete } = props

  const [zoom, setZoom] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const resetControls = useCallback((): void => {
    setZoom(1)
    setRotation(0)
    setOffset({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    if (isOpen) {
      resetControls()
    }
  }, [isOpen, resetControls])

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.currentTarget
    setImageSize({ width: target.naturalWidth, height: target.naturalHeight })
  }

  const handleMouseDown = (e: React.MouseEvent): void => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = (): void => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent): void => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y })
    }
  }

  const handleTouchMove = (e: React.TouchEvent): void => {
    if (!isDragging || e.touches.length !== 1) return
    const touch = e.touches[0]
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    })
  }

  const handleTouchEnd = (): void => {
    setIsDragging(false)
  }

  const handleRotate = (): void => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const aspect = imageSize.width > 0 && imageSize.height > 0 ? imageSize.width / imageSize.height : 1
  const baseWidth = aspect >= 1 ? CROP_MASK_SIZE * aspect : CROP_MASK_SIZE
  const baseHeight = aspect >= 1 ? CROP_MASK_SIZE : CROP_MASK_SIZE / aspect

  const handleApplyCrop = (): void => {
    if (!imageRef.current) return

    const canvas = document.createElement('canvas')
    const outputDimension = 400
    canvas.width = outputDimension
    canvas.height = outputDimension
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const scaleFactor = outputDimension / CROP_MASK_SIZE

    ctx.save()
    ctx.translate(outputDimension / 2, outputDimension / 2)
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor)
    ctx.scale(zoom, zoom)
    ctx.rotate((rotation * Math.PI) / 180)

    const drawW = baseWidth * scaleFactor
    const drawH = baseHeight * scaleFactor

    ctx.drawImage(
      imageRef.current,
      -drawW / 2,
      -drawH / 2,
      drawW,
      drawH
    )

    ctx.restore()

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.90)
    onCropComplete(croppedDataUrl)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Move size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sesuaikan & Potong Foto Profil</h3>
              <p className="text-[11px] text-slate-500">Geser dan atur perbesaran untuk posisi terbaik</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center space-y-6">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative bg-slate-950 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing shadow-inner select-none flex items-center justify-center"
            style={{ width: `${CONTAINER_SIZE}px`, height: `${CONTAINER_SIZE}px` }}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop Preview"
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
              draggable={false}
              className="max-w-none pointer-events-none select-none transition-transform duration-75 origin-center"
              style={{
                width: `${baseWidth}px`,
                height: `${baseHeight}px`,
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`
              }}
            />

            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="rounded-full border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.72)] ring-2 ring-white/50"
                style={{ width: `${CROP_MASK_SIZE}px`, height: `${CROP_MASK_SIZE}px` }}
              />
            </div>

            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-full pointer-events-none flex items-center gap-1.5">
              <Move size={11} className="text-emerald-400" />
              <span>Geser untuk memposisikan</span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ZoomIn size={14} className="text-emerald-600" />
                  <span>Perbesaran ({Math.round(zoom * 100)}%)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">0.8x - 3.0x</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(0.8, prev - 0.1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  title="Perkecil"
                >
                  <ZoomOut size={15} />
                </button>
                <input
                  type="range"
                  min="0.8"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  title="Perbesar"
                >
                  <ZoomIn size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer transition-colors"
                title="Putar 90 derajat searah jarum jam"
              >
                <RotateCw size={14} className="text-emerald-600" />
                <span>Putar 90°</span>
              </button>

              <button
                type="button"
                onClick={resetControls}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                title="Atur ulang posisi dan zoom"
              >
                <RotateCcw size={13} />
                <span>Reset Posisi</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Check size={15} />
            <span>Terapkan Hasil Potong</span>
          </button>
        </div>
      </div>
    </div>
  )
}
