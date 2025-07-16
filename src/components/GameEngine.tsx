import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  MousePointer,
  Grid3X3,
  Eye,
  EyeOff,
  Play,
  Pause,
  Users,
  Home,
  TreePine,
  Mountain,
  Waves,
  Plus,
  Settings,
  Camera,
  Target
} from 'lucide-react'

interface GameEngineProps {
  isPlaying: boolean
}

interface Camera {
  x: number
  y: number
  zoom: number
  rotation: number
  followTarget?: string
  smoothing: number
}

interface GameObject {
  id: string
  x: number
  y: number
  z: number
  type: 'character' | 'building' | 'tree' | 'rock' | 'npc' | 'player'
  color: string
  width: number
  height: number
  name?: string
  health?: number
  maxHealth?: number
  level?: number
  animation?: {
    frame: number
    speed: number
    type: 'idle' | 'walk' | 'attack'
  }
}

interface Biome {
  id: string
  name: string
  color: string
  pattern: string
  temperature: number
  humidity: number
}

export function GameEngine({ isPlaying }: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  
  const [camera, setCamera] = useState<Camera>({ 
    x: 0, 
    y: 0, 
    zoom: 1, 
    rotation: 0,
    smoothing: 0.1
  })
  
  const [tool, setTool] = useState<'select' | 'move' | 'place' | 'character'>('select')
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showUI, setShowUI] = useState(true)
  const [cameraMode, setCameraMode] = useState<'free' | 'follow'>('free')
  
  const [gameObjects, setGameObjects] = useState<GameObject[]>([
    { 
      id: 'player1', 
      x: 200, 
      y: 200, 
      z: 0, 
      type: 'player', 
      color: '#8B5CF6', 
      width: 24, 
      height: 32,
      name: 'Hero',
      health: 100,
      maxHealth: 100,
      level: 15,
      animation: { frame: 0, speed: 0.1, type: 'idle' }
    },
    { 
      id: 'npc1', 
      x: 300, 
      y: 150, 
      z: 0, 
      type: 'npc', 
      color: '#F59E0B', 
      width: 20, 
      height: 28,
      name: 'Village Elder',
      health: 80,
      maxHealth: 80,
      level: 25,
      animation: { frame: 0, speed: 0.05, type: 'idle' }
    },
    { 
      id: 'building1', 
      x: 400, 
      y: 100, 
      z: 0, 
      type: 'building', 
      color: '#6B7280', 
      width: 80, 
      height: 100,
      name: 'Town Hall'
    },
    { 
      id: 'tree1', 
      x: 150, 
      y: 300, 
      z: 0, 
      type: 'tree', 
      color: '#10B981', 
      width: 30, 
      height: 50,
      name: 'Ancient Oak'
    },
    { 
      id: 'tree2', 
      x: 500, 
      y: 250, 
      z: 0, 
      type: 'tree', 
      color: '#10B981', 
      width: 25, 
      height: 40,
      name: 'Pine Tree'
    },
    { 
      id: 'character1', 
      x: 350, 
      y: 300, 
      z: 0, 
      type: 'character', 
      color: '#DC2626', 
      width: 22, 
      height: 30,
      name: 'Warrior',
      health: 120,
      maxHealth: 120,
      level: 12,
      animation: { frame: 0, speed: 0.08, type: 'walk' }
    }
  ])

  const biomes: Biome[] = [
    { id: 'forest', name: 'Forest', color: '#10B981', pattern: 'trees', temperature: 60, humidity: 70 },
    { id: 'desert', name: 'Desert', color: '#F59E0B', pattern: 'sand', temperature: 90, humidity: 20 },
    { id: 'mountains', name: 'Mountains', color: '#6B7280', pattern: 'rocks', temperature: 40, humidity: 50 },
    { id: 'plains', name: 'Plains', color: '#84CC16', pattern: 'grass', temperature: 70, humidity: 60 }
  ]

  const [currentBiome, setCurrentBiome] = useState('forest')

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    if (!isPlaying) return

    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime

    // Update animations
    setGameObjects(prev => prev.map(obj => {
      if (obj.animation) {
        const newFrame = obj.animation.frame + (obj.animation.speed * deltaTime / 16.67) // 60fps base
        return {
          ...obj,
          animation: {
            ...obj.animation,
            frame: newFrame % 4 // 4 frame animation cycle
          }
        }
      }
      return obj
    }))

    // Camera following
    if (cameraMode === 'follow') {
      const player = gameObjects.find(obj => obj.type === 'player')
      if (player) {
        setCamera(prev => ({
          ...prev,
          x: prev.x + (player.x - prev.x) * prev.smoothing,
          y: prev.y + (player.y - prev.y) * prev.smoothing
        }))
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [isPlaying, gameObjects, cameraMode])

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now()
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, animate])

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Save context
      ctx.save()
      
      // Apply camera transformations
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(camera.zoom, camera.zoom)
      ctx.rotate(camera.rotation * Math.PI / 180)
      ctx.translate(-camera.x, -camera.y)
      
      // Draw biome background
      drawBiomeBackground(ctx, canvas.width, canvas.height)
      
      // Draw grid if enabled
      if (showGrid) {
        drawIsometricGrid(ctx, canvas.width, canvas.height)
      }
      
      // Sort objects by z-index and y position for proper 2.5D rendering
      const sortedObjects = [...gameObjects].sort((a, b) => {
        if (a.z !== b.z) return a.z - b.z
        return a.y + a.height - (b.y + b.height)
      })
      
      // Draw game objects
      sortedObjects.forEach(obj => {
        drawGameObject(ctx, obj)
      })
      
      // Draw selection highlight
      if (selectedObject) {
        const obj = gameObjects.find(o => o.id === selectedObject)
        if (obj) {
          drawSelectionHighlight(ctx, obj)
        }
      }
      
      // Restore context
      ctx.restore()
      
      // Draw UI overlay
      if (showUI) {
        drawUI(ctx, canvas.width, canvas.height)
      }
    }

    const drawBiomeBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const biome = biomes.find(b => b.id === currentBiome)
      if (!biome) return

      // Draw base color
      ctx.fillStyle = biome.color + '20'
      ctx.fillRect(-width, -height, width * 3, height * 3)

      // Draw biome pattern
      ctx.save()
      ctx.globalAlpha = 0.1
      
      const patternSize = 100
      for (let x = -width; x < width * 2; x += patternSize) {
        for (let y = -height; y < height * 2; y += patternSize) {
          drawBiomePattern(ctx, x, y, biome)
        }
      }
      
      ctx.restore()
    }

    const drawBiomePattern = (ctx: CanvasRenderingContext2D, x: number, y: number, biome: Biome) => {
      ctx.fillStyle = biome.color
      
      switch (biome.pattern) {
        case 'trees':
          ctx.beginPath()
          ctx.arc(x + 20, y + 30, 8, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillRect(x + 18, y + 30, 4, 15)
          break
        case 'sand':
          for (let i = 0; i < 5; i++) {
            ctx.beginPath()
            ctx.arc(x + Math.random() * 50, y + Math.random() * 50, 2, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        case 'rocks':
          ctx.fillRect(x + 10, y + 20, 15, 10)
          ctx.fillRect(x + 30, y + 15, 12, 8)
          break
        case 'grass':
          for (let i = 0; i < 8; i++) {
            ctx.fillRect(x + i * 6, y + 40, 2, 8)
          }
          break
      }
    }

    const drawIsometricGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)'
      ctx.lineWidth = 1
      
      const gridSize = 50
      const startX = -width * 2
      const startY = -height * 2
      const endX = width * 3
      const endY = height * 3
      
      // Draw isometric grid lines
      for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, startY)
        ctx.lineTo(x, endY)
        ctx.stroke()
      }
      
      for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(startX, y)
        ctx.lineTo(endX, y)
        ctx.stroke()
      }

      // Draw isometric diamond grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)'
      for (let x = startX; x < endX; x += gridSize) {
        for (let y = startY; y < endY; y += gridSize) {
          const isoX = x - y
          const isoY = (x + y) * 0.5
          
          ctx.beginPath()
          ctx.moveTo(isoX, isoY - gridSize * 0.25)
          ctx.lineTo(isoX + gridSize * 0.5, isoY)
          ctx.lineTo(isoX, isoY + gridSize * 0.25)
          ctx.lineTo(isoX - gridSize * 0.5, isoY)
          ctx.closePath()
          ctx.stroke()
        }
      }
    }

    const drawGameObject = (ctx: CanvasRenderingContext2D, obj: GameObject) => {
      ctx.save()
      
      // Calculate isometric position
      const isoX = obj.x - obj.y
      const isoY = (obj.x + obj.y) * 0.5 - obj.z
      
      // Draw shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      const shadowOffset = obj.z * 0.5
      ctx.fillRect(isoX - shadowOffset - 2, isoY + obj.height - 2 + shadowOffset, obj.width + 4, 6)
      
      // Draw object based on type
      switch (obj.type) {
        case 'player':
        case 'character':
          drawCharacter(ctx, isoX, isoY, obj)
          break
        case 'npc':
          drawNPC(ctx, isoX, isoY, obj)
          break
        case 'building':
          drawBuilding(ctx, isoX, isoY, obj)
          break
        case 'tree':
          drawTree(ctx, isoX, isoY, obj)
          break
        default:
          ctx.fillStyle = obj.color
          ctx.fillRect(isoX, isoY, obj.width, obj.height)
      }
      
      // Draw health bar for living entities
      if (obj.health !== undefined && obj.maxHealth !== undefined) {
        drawHealthBar(ctx, isoX, isoY - 10, obj.width, obj.health, obj.maxHealth)
      }
      
      // Draw name label
      if (obj.name) {
        drawNameLabel(ctx, isoX + obj.width / 2, isoY - 20, obj.name, obj.level)
      }
      
      ctx.restore()
    }

    const drawCharacter = (ctx: CanvasRenderingContext2D, x: number, y: number, obj: GameObject) => {
      const animFrame = Math.floor(obj.animation?.frame || 0) % 4
      const bobOffset = obj.animation?.type === 'walk' ? Math.sin(obj.animation.frame) * 2 : 0
      
      // Body
      ctx.fillStyle = obj.color
      ctx.fillRect(x + 6, y + 12 + bobOffset, 12, 18)
      
      // Head
      ctx.fillStyle = obj.type === 'player' ? '#FBBF24' : '#F3E8FF'
      ctx.fillRect(x + 7, y + 2 + bobOffset, 10, 10)
      
      // Arms (animated)
      ctx.fillStyle = obj.color
      const armOffset = obj.animation?.type === 'walk' ? Math.sin(obj.animation.frame + Math.PI) * 3 : 0
      ctx.fillRect(x + 2, y + 14 + bobOffset + armOffset, 4, 12)
      ctx.fillRect(x + 18, y + 14 + bobOffset - armOffset, 4, 12)
      
      // Legs (animated)
      const legOffset = obj.animation?.type === 'walk' ? Math.sin(obj.animation.frame) * 4 : 0
      ctx.fillStyle = '#374151'
      ctx.fillRect(x + 7, y + 30 + bobOffset + legOffset, 4, 10)
      ctx.fillRect(x + 13, y + 30 + bobOffset - legOffset, 4, 10)
      
      // Equipment/details
      if (obj.type === 'player') {
        // Crown/helmet
        ctx.fillStyle = '#FCD34D'
        ctx.fillRect(x + 6, y + 1 + bobOffset, 12, 3)
        
        // Weapon
        ctx.fillStyle = '#9CA3AF'
        ctx.fillRect(x + 22, y + 8 + bobOffset, 3, 15)
        ctx.fillStyle = '#F59E0B'
        ctx.fillRect(x + 21, y + 6 + bobOffset, 5, 4)
      }
    }

    const drawNPC = (ctx: CanvasRenderingContext2D, x: number, y: number, obj: GameObject) => {
      // Similar to character but with different styling
      ctx.fillStyle = obj.color
      ctx.fillRect(x + 5, y + 10, 10, 16)
      
      // Head
      ctx.fillStyle = '#F3E8FF'
      ctx.fillRect(x + 6, y + 2, 8, 8)
      
      // Special NPC indicator (hat/crown)
      ctx.fillStyle = '#7C3AED'
      ctx.fillRect(x + 4, y - 1, 12, 4)
      
      // Staff or tool
      ctx.fillStyle = '#92400E'
      ctx.fillRect(x + 16, y + 5, 2, 20)
      ctx.fillStyle = '#FCD34D'
      ctx.fillRect(x + 15, y + 3, 4, 4)
    }

    const drawBuilding = (ctx: CanvasRenderingContext2D, x: number, y: number, obj: GameObject) => {
      // Main building structure
      ctx.fillStyle = obj.color
      ctx.fillRect(x, y, obj.width, obj.height)
      
      // Roof with 3D effect
      ctx.fillStyle = '#7C2D12'
      ctx.beginPath()
      ctx.moveTo(x - 8, y)
      ctx.lineTo(x + obj.width / 2, y - 20)
      ctx.lineTo(x + obj.width + 8, y)
      ctx.closePath()
      ctx.fill()
      
      // Roof highlight
      ctx.fillStyle = '#92400E'
      ctx.beginPath()
      ctx.moveTo(x - 8, y)
      ctx.lineTo(x + obj.width / 2, y - 20)
      ctx.lineTo(x + obj.width / 2, y - 15)
      ctx.lineTo(x - 3, y)
      ctx.closePath()
      ctx.fill()
      
      // Windows
      ctx.fillStyle = '#FEF3C7'
      const windowSize = 8
      const windowSpacing = 15
      for (let i = 0; i < Math.floor(obj.width / windowSpacing); i++) {
        ctx.fillRect(x + 8 + i * windowSpacing, y + 20, windowSize, windowSize)
      }
      
      // Door
      ctx.fillStyle = '#92400E'
      ctx.fillRect(x + obj.width / 2 - 6, y + obj.height - 20, 12, 20)
      
      // Door handle
      ctx.fillStyle = '#FCD34D'
      ctx.fillRect(x + obj.width / 2 + 2, y + obj.height - 12, 2, 2)
    }

    const drawTree = (ctx: CanvasRenderingContext2D, x: number, y: number, obj: GameObject) => {
      // Trunk with 3D effect
      ctx.fillStyle = '#92400E'
      ctx.fillRect(x + obj.width / 2 - 4, y + obj.height - 15, 8, 15)
      
      // Trunk highlight
      ctx.fillStyle = '#A16207'
      ctx.fillRect(x + obj.width / 2 - 4, y + obj.height - 15, 3, 15)
      
      // Leaves (multiple layers for depth)
      const leafColors = ['#059669', '#10B981', '#34D399']
      leafColors.forEach((color, index) => {
        ctx.fillStyle = color
        const offset = index * 2
        ctx.beginPath()
        ctx.arc(x + obj.width / 2, y + 15 - offset, 18 - offset, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Leaf details
      ctx.fillStyle = '#065F46'
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2
        const leafX = x + obj.width / 2 + Math.cos(angle) * 12
        const leafY = y + 15 + Math.sin(angle) * 12
        ctx.fillRect(leafX - 1, leafY - 1, 2, 2)
      }
    }

    const drawHealthBar = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, health: number, maxHealth: number) => {
      const barWidth = width
      const barHeight = 4
      const healthPercent = health / maxHealth
      
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // Health bar
      ctx.fillStyle = healthPercent > 0.6 ? '#10B981' : healthPercent > 0.3 ? '#F59E0B' : '#DC2626'
      ctx.fillRect(x, y, barWidth * healthPercent, barHeight)
      
      // Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, barWidth, barHeight)
    }

    const drawNameLabel = (ctx: CanvasRenderingContext2D, x: number, y: number, name: string, level?: number) => {
      ctx.font = '10px Inter'
      ctx.textAlign = 'center'
      
      const text = level ? `${name} (${level})` : name
      const textWidth = ctx.measureText(text).width
      
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(x - textWidth / 2 - 4, y - 12, textWidth + 8, 14)
      
      // Text
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(text, x, y - 2)
      
      ctx.textAlign = 'start'
    }

    const drawSelectionHighlight = (ctx: CanvasRenderingContext2D, obj: GameObject) => {
      const isoX = obj.x - obj.y
      const isoY = (obj.x + obj.y) * 0.5 - obj.z
      
      ctx.strokeStyle = '#8B5CF6'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(isoX - 5, isoY - 5, obj.width + 10, obj.height + 10)
      ctx.setLineDash([])
    }

    const drawUI = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Camera info
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(10, 10, 220, 100)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '12px JetBrains Mono'
      ctx.fillText(`Camera: (${camera.x.toFixed(0)}, ${camera.y.toFixed(0)})`, 20, 30)
      ctx.fillText(`Zoom: ${(camera.zoom * 100).toFixed(0)}%`, 20, 50)
      ctx.fillText(`Rotation: ${camera.rotation.toFixed(0)}°`, 20, 70)
      ctx.fillText(`Mode: ${cameraMode}`, 20, 90)
      
      // Biome info
      const biome = biomes.find(b => b.id === currentBiome)
      if (biome) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(width - 180, 10, 170, 80)
        
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText(`Biome: ${biome.name}`, width - 170, 30)
        ctx.fillText(`Temp: ${biome.temperature}°`, width - 170, 50)
        ctx.fillText(`Humidity: ${biome.humidity}%`, width - 170, 70)
      }
      
      // Selected object info
      if (selectedObject) {
        const obj = gameObjects.find(o => o.id === selectedObject)
        if (obj) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
          ctx.fillRect(10, height - 120, 200, 110)
          
          ctx.fillStyle = '#FFFFFF'
          ctx.fillText(`Selected: ${obj.name || obj.type}`, 20, height - 100)
          ctx.fillText(`Position: (${obj.x}, ${obj.y})`, 20, height - 80)
          if (obj.health !== undefined) {
            ctx.fillText(`Health: ${obj.health}/${obj.maxHealth}`, 20, height - 60)
          }
          if (obj.level !== undefined) {
            ctx.fillText(`Level: ${obj.level}`, 20, height - 40)
          }
          ctx.fillText(`Type: ${obj.type}`, 20, height - 20)
        }
      }
    }

    render()
  }, [camera, gameObjects, showGrid, showUI, tool, selectedObject, currentBiome, biomes])

  const handleZoomIn = () => {
    setCamera(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }))
  }

  const handleZoomOut = () => {
    setCamera(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.3) }))
  }

  const handleResetCamera = () => {
    setCamera(prev => ({ ...prev, x: 0, y: 0, zoom: 1, rotation: 0 }))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Convert screen coordinates to world coordinates
    const worldX = (mouseX - canvas.width / 2) / camera.zoom + camera.x
    const worldY = (mouseY - canvas.height / 2) / camera.zoom + camera.y

    if (tool === 'select') {
      // Find clicked object
      const clickedObject = gameObjects.find(obj => {
        const isoX = obj.x - obj.y
        const isoY = (obj.x + obj.y) * 0.5 - obj.z
        return worldX >= isoX && worldX <= isoX + obj.width &&
               worldY >= isoY && worldY <= isoY + obj.height
      })
      
      setSelectedObject(clickedObject?.id || null)
    } else if (tool === 'move') {
      // Start camera panning
      const startCamera = { ...camera }
      const startMouse = { x: mouseX, y: mouseY }

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = (e.clientX - rect.left - startMouse.x) / camera.zoom
        const deltaY = (e.clientY - rect.top - startMouse.y) / camera.zoom
        
        setCamera({
          ...startCamera,
          x: startCamera.x - deltaX,
          y: startCamera.y - deltaY
        })
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else if (tool === 'character') {
      // Place new character
      const newCharacter: GameObject = {
        id: `char_${Date.now()}`,
        x: worldX,
        y: worldY,
        z: 0,
        type: 'character',
        color: '#DC2626',
        width: 22,
        height: 30,
        name: 'New Character',
        health: 100,
        maxHealth: 100,
        level: 1,
        animation: { frame: 0, speed: 0.08, type: 'idle' }
      }
      
      setGameObjects(prev => [...prev, newCharacter])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const moveSpeed = 10
    
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        setCamera(prev => ({ ...prev, y: prev.y - moveSpeed }))
        break
      case 's':
      case 'ArrowDown':
        setCamera(prev => ({ ...prev, y: prev.y + moveSpeed }))
        break
      case 'a':
      case 'ArrowLeft':
        setCamera(prev => ({ ...prev, x: prev.x - moveSpeed }))
        break
      case 'd':
      case 'ArrowRight':
        setCamera(prev => ({ ...prev, x: prev.x + moveSpeed }))
        break
      case 'Delete':
        if (selectedObject) {
          setGameObjects(prev => prev.filter(obj => obj.id !== selectedObject))
          setSelectedObject(null)
        }
        break
    }
  }

  return (
    <div className="h-full flex" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Game Viewport */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={1000}
          height={700}
          className="w-full h-full game-viewport cursor-crosshair bg-gradient-to-br from-slate-900 to-slate-800"
          onMouseDown={handleMouseDown}
        />
        
        {/* Viewport Controls */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <Card className="p-2 glass-effect">
            <div className="flex space-x-1">
              <Button
                variant={tool === 'select' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('select')}
                title="Select Tool (S)"
              >
                <MousePointer className="w-4 h-4" />
              </Button>
              <Button
                variant={tool === 'move' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('move')}
                title="Move Camera (M)"
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                variant={tool === 'character' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('character')}
                title="Place Character (C)"
              >
                <Users className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                title="Toggle Grid (G)"
              >
                {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
          </Card>
          
          <Card className="p-2 glass-effect">
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={handleZoomIn} title="Zoom In (+)">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleZoomOut} title="Zoom Out (-)">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleResetCamera} title="Reset Camera (R)">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <div className="w-32">
                <Slider
                  value={[camera.zoom * 100]}
                  onValueChange={([value]) => setCamera(prev => ({ ...prev, zoom: value / 100 }))}
                  min={30}
                  max={300}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          <Card className="p-2 glass-effect">
            <div className="flex space-x-1">
              <Button
                variant={cameraMode === 'free' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCameraMode('free')}
                title="Free Camera"
              >
                <Camera className="w-4 h-4" />
              </Button>
              <Button
                variant={cameraMode === 'follow' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCameraMode('follow')}
                title="Follow Player"
              >
                <Target className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Biome Selector */}
        <div className="absolute top-4 right-4">
          <Card className="p-3 glass-effect">
            <Label className="text-sm font-medium mb-2 block">Current Biome</Label>
            <div className="grid grid-cols-2 gap-1">
              {biomes.map(biome => (
                <Button
                  key={biome.id}
                  variant={currentBiome === biome.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentBiome(biome.id)}
                  className="justify-start"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: biome.color }}
                  />
                  {biome.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-3 glass-effect">
            <div className="flex justify-between items-center text-sm">
              <div className="flex space-x-4">
                <span>Objects: {gameObjects.length}</span>
                <span>FPS: {isPlaying ? '60' : '0'}</span>
                <span>Status: {isPlaying ? 'Playing' : 'Paused'}</span>
                <span>Tool: {tool}</span>
              </div>
              <div className="flex space-x-4">
                <span>Zoom: {(camera.zoom * 100).toFixed(0)}%</span>
                <span>Position: ({camera.x.toFixed(0)}, {camera.y.toFixed(0)})</span>
                <span>Biome: {biomes.find(b => b.id === currentBiome)?.name}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Panel - Game Properties */}
      <div className="w-80 border-l border-border bg-card/50 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Game Properties</h3>
        
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-3">Camera Settings</h4>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Zoom</Label>
                <Slider
                  value={[camera.zoom * 100]}
                  onValueChange={([value]) => setCamera(prev => ({ ...prev, zoom: value / 100 }))}
                  min={30}
                  max={300}
                  step={10}
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">{(camera.zoom * 100).toFixed(0)}%</div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Rotation</Label>
                <Slider
                  value={[camera.rotation]}
                  onValueChange={([value]) => setCamera(prev => ({ ...prev, rotation: value }))}
                  min={-180}
                  max={180}
                  step={5}
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">{camera.rotation.toFixed(0)}°</div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Smoothing</Label>
                <Slider
                  value={[camera.smoothing * 100]}
                  onValueChange={([value]) => setCamera(prev => ({ ...prev, smoothing: value / 100 }))}
                  min={1}
                  max={50}
                  step={1}
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">{(camera.smoothing * 100).toFixed(0)}%</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">Scene Objects</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {gameObjects.map(obj => (
                <div 
                  key={obj.id} 
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    selectedObject === obj.id ? 'bg-primary/20' : 'bg-muted/50 hover:bg-muted/70'
                  }`}
                  onClick={() => setSelectedObject(obj.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: obj.color }}
                    />
                    <div>
                      <div className="text-sm font-medium">{obj.name || obj.type}</div>
                      {obj.level && (
                        <div className="text-xs text-muted-foreground">Level {obj.level}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ({obj.x.toFixed(0)}, {obj.y.toFixed(0)})
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">Rendering Options</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Grid</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show UI</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUI(!showUI)}
                >
                  {showUI ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>

          {selectedObject && (
            <Card className="p-4">
              <h4 className="font-medium mb-3">Selected Object</h4>
              {(() => {
                const obj = gameObjects.find(o => o.id === selectedObject)
                if (!obj) return null
                
                return (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <Input
                        value={obj.name || ''}
                        onChange={(e) => {
                          setGameObjects(prev => prev.map(o => 
                            o.id === selectedObject ? { ...o, name: e.target.value } : o
                          ))
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">X</Label>
                        <Input
                          type="number"
                          value={obj.x}
                          onChange={(e) => {
                            setGameObjects(prev => prev.map(o => 
                              o.id === selectedObject ? { ...o, x: Number(e.target.value) } : o
                            ))
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Y</Label>
                        <Input
                          type="number"
                          value={obj.y}
                          onChange={(e) => {
                            setGameObjects(prev => prev.map(o => 
                              o.id === selectedObject ? { ...o, y: Number(e.target.value) } : o
                            ))
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    {obj.health !== undefined && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Health</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="number"
                            value={obj.health}
                            onChange={(e) => {
                              setGameObjects(prev => prev.map(o => 
                                o.id === selectedObject ? { ...o, health: Number(e.target.value) } : o
                              ))
                            }}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">/ {obj.maxHealth}</span>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setGameObjects(prev => prev.filter(o => o.id !== selectedObject))
                        setSelectedObject(null)
                      }}
                      className="w-full mt-3"
                    >
                      Delete Object
                    </Button>
                  </div>
                )
              })()}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}