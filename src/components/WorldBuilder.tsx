import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { 
  Mountain, 
  Trees, 
  Waves, 
  Sun, 
  Snowflake, 
  MapPin,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Layers,
  Palette,
  Settings
} from 'lucide-react'

interface Biome {
  id: string
  name: string
  color: string
  icon: React.ReactNode
  temperature: number
  humidity: number
  features: string[]
}

interface WorldRegion {
  id: string
  name: string
  biome: string
  x: number
  y: number
  width: number
  height: number
  level: number
  npcs: string[]
  resources: string[]
}

interface WorldLayer {
  id: string
  name: string
  visible: boolean
  opacity: number
  type: 'terrain' | 'objects' | 'npcs' | 'effects'
}

export function WorldBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<'select' | 'paint' | 'erase'>('select')
  const [selectedBiome, setSelectedBiome] = useState('forest')
  const [brushSize, setBrushSize] = useState(20)
  const [showGrid, setShowGrid] = useState(true)
  const [zoom, setZoom] = useState(1)
  
  const biomes: Biome[] = useMemo(() => [
    {
      id: 'forest',
      name: 'Forest',
      color: '#10B981',
      icon: <Trees className="w-4 h-4" />,
      temperature: 60,
      humidity: 70,
      features: ['Dense Trees', 'Wildlife', 'Rivers']
    },
    {
      id: 'desert',
      name: 'Desert',
      color: '#F59E0B',
      icon: <Sun className="w-4 h-4" />,
      temperature: 90,
      humidity: 20,
      features: ['Sand Dunes', 'Oasis', 'Cacti']
    },
    {
      id: 'mountains',
      name: 'Mountains',
      color: '#6B7280',
      icon: <Mountain className="w-4 h-4" />,
      temperature: 40,
      humidity: 50,
      features: ['High Peaks', 'Caves', 'Minerals']
    },
    {
      id: 'ocean',
      name: 'Ocean',
      color: '#3B82F6',
      icon: <Waves className="w-4 h-4" />,
      temperature: 65,
      humidity: 100,
      features: ['Deep Water', 'Islands', 'Sea Creatures']
    },
    {
      id: 'tundra',
      name: 'Tundra',
      color: '#E5E7EB',
      icon: <Snowflake className="w-4 h-4" />,
      temperature: 20,
      humidity: 40,
      features: ['Frozen Ground', 'Ice', 'Aurora']
    }
  ], [])

  const [worldRegions, setWorldRegions] = useState<WorldRegion[]>([
    {
      id: '1',
      name: 'Starter Forest',
      biome: 'forest',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      level: 1,
      npcs: ['Village Elder', 'Merchant'],
      resources: ['Wood', 'Herbs']
    },
    {
      id: '2',
      name: 'Burning Desert',
      biome: 'desert',
      x: 350,
      y: 200,
      width: 180,
      height: 120,
      level: 15,
      npcs: ['Desert Nomad'],
      resources: ['Sand', 'Gems']
    },
    {
      id: '3',
      name: 'Frozen Peaks',
      biome: 'mountains',
      x: 150,
      y: 300,
      width: 160,
      height: 140,
      level: 25,
      npcs: ['Mountain Guide'],
      resources: ['Stone', 'Iron Ore']
    }
  ])

  const [layers, setLayers] = useState<WorldLayer[]>([
    { id: '1', name: 'Terrain', visible: true, opacity: 100, type: 'terrain' },
    { id: '2', name: 'Objects', visible: true, opacity: 100, type: 'objects' },
    { id: '3', name: 'NPCs', visible: true, opacity: 80, type: 'npcs' },
    { id: '4', name: 'Effects', visible: false, opacity: 60, type: 'effects' }
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
      
      // Apply zoom
      ctx.scale(zoom, zoom)
      
      // Draw grid if enabled
      if (showGrid) {
        drawGrid(ctx, canvas.width / zoom, canvas.height / zoom)
      }
      
      // Draw world regions
      worldRegions.forEach(region => {
        drawRegion(ctx, region)
      })
      
      // Restore context
      ctx.restore()
    }

    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      ctx.lineWidth = 1
      
      const gridSize = 50
      
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    const drawRegion = (ctx: CanvasRenderingContext2D, region: WorldRegion) => {
      const biome = biomes.find(b => b.id === region.biome)
      if (!biome) return
      
      // Draw region background
      ctx.fillStyle = biome.color + '40'
      ctx.fillRect(region.x, region.y, region.width, region.height)
      
      // Draw region border
      ctx.strokeStyle = biome.color
      ctx.lineWidth = 2
      ctx.strokeRect(region.x, region.y, region.width, region.height)
      
      // Draw region label
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '14px Inter'
      ctx.fillText(region.name, region.x + 10, region.y + 25)
      
      // Draw level indicator
      ctx.fillStyle = biome.color
      ctx.font = '12px Inter'
      ctx.fillText(`Lv. ${region.level}`, region.x + 10, region.y + 45)
      
      // Draw biome pattern
      drawBiomePattern(ctx, region, biome)
    }

    const drawBiomePattern = (ctx: CanvasRenderingContext2D, region: WorldRegion, biome: Biome) => {
      ctx.save()
      ctx.globalAlpha = 0.3
      
      switch (biome.id) {
        case 'forest':
          // Draw trees
          for (let i = 0; i < 8; i++) {
            const x = region.x + Math.random() * region.width
            const y = region.y + Math.random() * region.height
            ctx.fillStyle = '#10B981'
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2)
            ctx.fill()
          }
          break
          
        case 'desert':
          // Draw sand dunes
          ctx.fillStyle = '#F59E0B'
          for (let i = 0; i < 5; i++) {
            const x = region.x + Math.random() * region.width
            const y = region.y + region.height - 20
            ctx.beginPath()
            ctx.arc(x, y, 15, 0, Math.PI)
            ctx.fill()
          }
          break
          
        case 'mountains':
          // Draw mountain peaks
          ctx.fillStyle = '#6B7280'
          for (let i = 0; i < 4; i++) {
            const x = region.x + (i * region.width / 4) + 20
            const y = region.y + region.height - 10
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + 15, y - 30)
            ctx.lineTo(x + 30, y)
            ctx.closePath()
            ctx.fill()
          }
          break
          
        case 'ocean':
          // Draw waves
          ctx.strokeStyle = '#3B82F6'
          ctx.lineWidth = 2
          for (let i = 0; i < 6; i++) {
            const y = region.y + (i * 20) + 30
            ctx.beginPath()
            ctx.moveTo(region.x, y)
            for (let x = region.x; x < region.x + region.width; x += 20) {
              ctx.quadraticCurveTo(x + 10, y - 5, x + 20, y)
            }
            ctx.stroke()
          }
          break
          
        case 'tundra':
          // Draw ice crystals
          ctx.fillStyle = '#E5E7EB'
          for (let i = 0; i < 10; i++) {
            const x = region.x + Math.random() * region.width
            const y = region.y + Math.random() * region.height
            ctx.fillRect(x, y, 3, 3)
          }
          break
      }
      
      ctx.restore()
    }

    render()
  }, [worldRegions, biomes, showGrid, zoom])

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ))
  }

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ))
  }

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Tools */}
      <div className="w-64 border-r border-border bg-card/50 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">World Builder</h3>
            
            <div className="space-y-2">
              <Label>Tool</Label>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  variant={selectedTool === 'select' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('select')}
                >
                  Select
                </Button>
                <Button
                  variant={selectedTool === 'paint' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('paint')}
                >
                  Paint
                </Button>
                <Button
                  variant={selectedTool === 'erase' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('erase')}
                >
                  Erase
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Biomes</Label>
            <div className="grid gap-2 mt-2">
              {biomes.map(biome => (
                <Button
                  key={biome.id}
                  variant={selectedBiome === biome.id ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setSelectedBiome(biome.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: biome.color }}
                    />
                    {biome.icon}
                    <span>{biome.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Brush Size</Label>
            <Slider
              value={[brushSize]}
              onValueChange={([value]) => setBrushSize(value)}
              min={5}
              max={50}
              step={5}
              className="mt-2"
            />
            <div className="text-sm text-muted-foreground mt-1">{brushSize}px</div>
          </div>

          <div>
            <Label>Zoom</Label>
            <Slider
              value={[zoom * 100]}
              onValueChange={([value]) => setZoom(value / 100)}
              min={50}
              max={200}
              step={10}
              className="mt-2"
            />
            <div className="text-sm text-muted-foreground mt-1">{(zoom * 100).toFixed(0)}%</div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Grid</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full bg-background border cursor-crosshair"
        />
        
        {/* Canvas Controls */}
        <div className="absolute top-4 right-4">
          <Card className="p-2 glass-effect">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Sidebar - Layers & Properties */}
      <div className="w-80 border-l border-border bg-card/50 p-4 overflow-y-auto">
        <Tabs defaultValue="layers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="layers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Layers</h4>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2">
              {layers.map(layer => (
                <Card key={layer.id} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className="p-0 h-6 w-6"
                      >
                        {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Layers className="w-4 h-4" />
                      <span className="text-sm font-medium">{layer.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {layer.type}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Opacity</Label>
                    <Slider
                      value={[layer.opacity]}
                      onValueChange={([value]) => updateLayerOpacity(layer.id, value)}
                      min={0}
                      max={100}
                      step={10}
                      className="mt-1"
                    />
                    <div className="text-xs text-muted-foreground mt-1">{layer.opacity}%</div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="regions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">World Regions</h4>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {worldRegions.map(region => {
                const biome = biomes.find(b => b.id === region.biome)
                return (
                  <Card key={region.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: biome?.color }}
                        />
                        <span className="font-medium text-sm">{region.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Biome:</span>
                        <span className="capitalize">{region.biome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Level:</span>
                        <span>{region.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{region.width}×{region.height}</span>
                      </div>
                      
                      {region.npcs.length > 0 && (
                        <div>
                          <div className="text-muted-foreground mb-1">NPCs:</div>
                          <div className="flex flex-wrap gap-1">
                            {region.npcs.map(npc => (
                              <Badge key={npc} variant="secondary" className="text-xs">
                                {npc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {region.resources.length > 0 && (
                        <div>
                          <div className="text-muted-foreground mb-1">Resources:</div>
                          <div className="flex flex-wrap gap-1">
                            {region.resources.map(resource => (
                              <Badge key={resource} variant="outline" className="text-xs">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}