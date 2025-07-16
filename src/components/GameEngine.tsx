import React, { useRef, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Slider } from './ui/slider'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  MousePointer,
  Grid3X3,
  Eye,
  EyeOff
} from 'lucide-react'

interface GameEngineProps {
  isPlaying: boolean
}

interface Camera {
  x: number
  y: number
  zoom: number
  rotation: number
}

interface GameObject {
  id: string
  x: number
  y: number
  z: number
  type: 'character' | 'building' | 'tree' | 'rock' | 'npc'
  color: string
  width: number
  height: number
}

export function GameEngine({ isPlaying }: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1, rotation: 0 })
  const [tool, setTool] = useState<'select' | 'move' | 'place'>('select')
  const [showGrid, setShowGrid] = useState(true)
  const [gameObjects, setGameObjects] = useState<GameObject[]>([
    { id: '1', x: 100, y: 100, z: 0, type: 'character', color: '#8B5CF6', width: 20, height: 30 },
    { id: '2', x: 200, y: 150, z: 0, type: 'building', color: '#6B7280', width: 60, height: 80 },
    { id: '3', x: 300, y: 80, z: 0, type: 'tree', color: '#10B981', width: 25, height: 40 },
    { id: '4', x: 150, y: 250, z: 0, type: 'npc', color: '#F59E0B', width: 18, height: 28 },
  ])

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
      
      // Draw grid if enabled
      if (showGrid) {
        drawIsometricGrid(ctx, canvas.width, canvas.height)
      }
      
      // Sort objects by z-index and y position for proper 2.5D rendering
      const sortedObjects = [...gameObjects].sort((a, b) => {
        if (a.z !== b.z) return a.z - b.z
        return a.y - b.y
      })
      
      // Draw game objects
      sortedObjects.forEach(obj => {
        drawGameObject(ctx, obj)
      })
      
      // Restore context
      ctx.restore()
      
      // Draw UI overlay
      drawUI(ctx, canvas.width, canvas.height)
    }

    const drawIsometricGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      ctx.lineWidth = 1
      
      const gridSize = 40
      const startX = -width
      const startY = -height
      const endX = width * 2
      const endY = height * 2
      
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
    }

    const drawGameObject = (ctx: CanvasRenderingContext2D, obj: GameObject) => {
      ctx.save()
      
      // Calculate isometric position
      const isoX = obj.x - obj.y
      const isoY = (obj.x + obj.y) * 0.5 - obj.z
      
      // Draw shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.fillRect(isoX - 2, isoY + obj.height - 2, obj.width + 4, 4)
      
      // Draw object based on type
      switch (obj.type) {
        case 'character':
          drawCharacter(ctx, isoX, isoY, obj)
          break
        case 'building':
          drawBuilding(ctx, isoX, isoY, obj)
          break
        case 'tree':
          drawTree(ctx, isoX, isoY, obj)
          break
        case 'npc':
          drawNPC(ctx, isoX, isoY, obj)
          break
        default:
          ctx.fillStyle = obj.color
          ctx.fillRect(isoX, isoY, obj.width, obj.height)
      }
      
      ctx.restore()
    }

    const drawCharacter = (ctx: CanvasRenderingContext2D, x: number, y: number, obj: GameObject) => {
      // Body
      ctx.fillStyle = obj.color
      ctx.fillRect(x + 5, y + 10, 10, 15)
      
      // Head
      ctx.fillStyle = '#FBBF24'
      ctx.fillRect(x + 6, y, 8, 8)
      
      // Legs
      ctx.fillStyle = '#374151'
      ctx.fillRect(x + 6, y + 25, 3, 8)
      ctx.fillRect(x + 11, y + 25, 3, 8)
    }

    const drawBuilding = (ctx: CanvasRenderingContext2D, x: number, y: number, obj: GameObject) => {
      // Main building
      ctx.fillStyle = obj.color
      ctx.fillRect(x, y, obj.width, obj.height)
      
      // Roof
      ctx.fillStyle = '#7C2D12'
      ctx.beginPath()
      ctx.moveTo(x - 5, y)
      ctx.lineTo(x + obj.width / 2, y - 15)
      ctx.lineTo(x + obj.width + 5, y)
      ctx.closePath()
      ctx.fill()
      
      // Windows
      ctx.fillStyle = '#FEF3C7'
      ctx.fillRect(x + 10, y + 15, 8, 8)
      ctx.fillRect(x + 25, y + 15, 8, 8)
      ctx.fillRect(x + 40, y + 15, 8, 8)
    }

    const drawTree = (ctx: CanvasRenderingContext2D, x: number, y: number, obj: GameObject) => {
      // Trunk
      ctx.fillStyle = '#92400E'
      ctx.fillRect(x + 8, y + 25, 8, 15)
      
      // Leaves
      ctx.fillStyle = obj.color
      ctx.beginPath()
      ctx.arc(x + 12, y + 15, 15, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawNPC = (ctx: CanvasRenderingContext2D, x: number, y: number, obj: GameObject) => {
      // Similar to character but with different colors
      ctx.fillStyle = obj.color
      ctx.fillRect(x + 4, y + 8, 10, 15)
      
      // Head
      ctx.fillStyle = '#F3E8FF'
      ctx.fillRect(x + 5, y, 8, 8)
      
      // Hat/Crown
      ctx.fillStyle = '#7C3AED'
      ctx.fillRect(x + 4, y - 2, 10, 3)
    }

    const drawUI = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Draw camera info
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(10, 10, 200, 80)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '12px JetBrains Mono'
      ctx.fillText(`Camera: (${camera.x.toFixed(0)}, ${camera.y.toFixed(0)})`, 20, 30)
      ctx.fillText(`Zoom: ${(camera.zoom * 100).toFixed(0)}%`, 20, 50)
      ctx.fillText(`Rotation: ${camera.rotation.toFixed(0)}°`, 20, 70)
      
      // Draw tool info
      ctx.fillText(`Tool: ${tool}`, 20, 90)
    }

    render()
  }, [camera, gameObjects, showGrid, tool, isPlaying])

  const handleZoomIn = () => {
    setCamera(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }))
  }

  const handleZoomOut = () => {
    setCamera(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.3) }))
  }

  const handleResetCamera = () => {
    setCamera({ x: 0, y: 0, zoom: 1, rotation: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tool === 'move') {
      // Start camera panning
      const startCamera = { ...camera }
      const startMouse = { x, y }

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
    }
  }

  return (
    <div className="h-full flex">
      {/* Game Viewport */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full game-viewport cursor-crosshair"
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
              >
                <MousePointer className="w-4 h-4" />
              </Button>
              <Button
                variant={tool === 'move' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('move')}
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
          </Card>
          
          <Card className="p-2 glass-effect">
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleResetCamera}>
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
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-3 glass-effect">
            <div className="flex justify-between items-center text-sm">
              <div className="flex space-x-4">
                <span>Objects: {gameObjects.length}</span>
                <span>FPS: {isPlaying ? '60' : '0'}</span>
                <span>Status: {isPlaying ? 'Playing' : 'Paused'}</span>
              </div>
              <div className="flex space-x-4">
                <span>Zoom: {(camera.zoom * 100).toFixed(0)}%</span>
                <span>Position: ({camera.x.toFixed(0)}, {camera.y.toFixed(0)})</span>
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
            <h4 className="font-medium mb-2">Camera Settings</h4>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-muted-foreground">Zoom</label>
                <Slider
                  value={[camera.zoom * 100]}
                  onValueChange={([value]) => setCamera(prev => ({ ...prev, zoom: value / 100 }))}
                  min={30}
                  max={300}
                  step={10}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Rotation</label>
                <Slider
                  value={[camera.rotation]}
                  onValueChange={([value]) => setCamera(prev => ({ ...prev, rotation: value }))}
                  min={-180}
                  max={180}
                  step={5}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2">Scene Objects</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {gameObjects.map(obj => (
                <div key={obj.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: obj.color }}
                    />
                    <span className="text-sm capitalize">{obj.type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({obj.x}, {obj.y})
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2">Rendering</h4>
            <div className="space-y-2">
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}