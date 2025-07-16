import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { Textarea } from './ui/textarea'
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
  Settings,
  Save,
  Download,
  Upload,
  Zap,
  Home,
  Users,
  Gem,
  Pickaxe,
  Sword,
  Shield
} from 'lucide-react'

interface Biome {
  id: string
  name: string
  color: string
  icon: React.ReactNode
  temperature: number
  humidity: number
  features: string[]
  resources: string[]
  difficulty: number
  spawnRate: number
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
  npcs: NPC[]
  resources: Resource[]
  structures: Structure[]
  description: string
}

interface NPC {
  id: string
  name: string
  type: 'merchant' | 'quest_giver' | 'guard' | 'enemy' | 'neutral'
  level: number
  x: number
  y: number
  dialogue?: string
}

interface Resource {
  id: string
  name: string
  type: 'mineral' | 'herb' | 'wood' | 'water' | 'magical'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  respawnTime: number
  x: number
  y: number
}

interface Structure {
  id: string
  name: string
  type: 'building' | 'dungeon' | 'landmark' | 'portal'
  x: number
  y: number
  width: number
  height: number
  description: string
}

interface WorldLayer {
  id: string
  name: string
  visible: boolean
  opacity: number
  type: 'terrain' | 'objects' | 'npcs' | 'effects' | 'resources'
  locked: boolean
}

export function WorldBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<'select' | 'paint' | 'erase' | 'npc' | 'resource' | 'structure'>('select')
  const [selectedBiome, setSelectedBiome] = useState('forest')
  const [brushSize, setBrushSize] = useState(20)
  const [showGrid, setShowGrid] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [cameraX, setCameraX] = useState(0)
  const [cameraY, setCameraY] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  const biomes: Biome[] = useMemo(() => [
    {
      id: 'forest',
      name: 'Enchanted Forest',
      color: '#10B981',
      icon: <Trees className="w-4 h-4" />,
      temperature: 60,
      humidity: 70,
      features: ['Dense Trees', 'Wildlife', 'Rivers', 'Hidden Paths'],
      resources: ['Wood', 'Herbs', 'Berries', 'Mushrooms'],
      difficulty: 2,
      spawnRate: 0.3
    },
    {
      id: 'desert',
      name: 'Scorching Desert',
      color: '#F59E0B',
      icon: <Sun className="w-4 h-4" />,
      temperature: 90,
      humidity: 20,
      features: ['Sand Dunes', 'Oasis', 'Cacti', 'Mirages'],
      resources: ['Sand', 'Gems', 'Rare Metals', 'Crystal'],
      difficulty: 4,
      spawnRate: 0.1
    },
    {
      id: 'mountains',
      name: 'Frozen Peaks',
      color: '#6B7280',
      icon: <Mountain className="w-4 h-4" />,
      temperature: 40,
      humidity: 50,
      features: ['High Peaks', 'Caves', 'Minerals', 'Ancient Ruins'],
      resources: ['Stone', 'Iron Ore', 'Gold', 'Mithril'],
      difficulty: 5,
      spawnRate: 0.2
    },
    {
      id: 'ocean',
      name: 'Mystic Ocean',
      color: '#3B82F6',
      icon: <Waves className="w-4 h-4" />,
      temperature: 65,
      humidity: 100,
      features: ['Deep Water', 'Islands', 'Sea Creatures', 'Coral Reefs'],
      resources: ['Fish', 'Pearls', 'Seaweed', 'Shells'],
      difficulty: 3,
      spawnRate: 0.4
    },
    {
      id: 'tundra',
      name: 'Frozen Tundra',
      color: '#E5E7EB',
      icon: <Snowflake className="w-4 h-4" />,
      temperature: 20,
      humidity: 40,
      features: ['Frozen Ground', 'Ice', 'Aurora', 'Glaciers'],
      resources: ['Ice', 'Fur', 'Frozen Herbs', 'Ice Crystals'],
      difficulty: 4,
      spawnRate: 0.15
    },
    {
      id: 'volcanic',
      name: 'Volcanic Wasteland',
      color: '#DC2626',
      icon: <Zap className="w-4 h-4" />,
      temperature: 95,
      humidity: 30,
      features: ['Lava Flows', 'Geysers', 'Ash Storms', 'Fire Elementals'],
      resources: ['Obsidian', 'Sulfur', 'Fire Gems', 'Lava Rock'],
      difficulty: 6,
      spawnRate: 0.05
    }
  ], [])

  const [worldRegions, setWorldRegions] = useState<WorldRegion[]>([
    {
      id: '1',
      name: 'Whispering Woods',
      biome: 'forest',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      level: 1,
      description: 'A peaceful forest where new adventurers begin their journey.',
      npcs: [
        { id: 'npc1', name: 'Village Elder', type: 'quest_giver', level: 50, x: 150, y: 125, dialogue: 'Welcome, young adventurer!' },
        { id: 'npc2', name: 'Merchant Tom', type: 'merchant', level: 20, x: 180, y: 140 }
      ],
      resources: [
        { id: 'res1', name: 'Oak Wood', type: 'wood', rarity: 'common', respawnTime: 300, x: 120, y: 110 },
        { id: 'res2', name: 'Healing Herbs', type: 'herb', rarity: 'uncommon', respawnTime: 600, x: 160, y: 130 }
      ],
      structures: [
        { id: 'str1', name: 'Village Hall', type: 'building', x: 170, y: 120, width: 40, height: 30, description: 'The heart of the village' }
      ]
    },
    {
      id: '2',
      name: 'Burning Sands',
      biome: 'desert',
      x: 350,
      y: 200,
      width: 180,
      height: 120,
      level: 15,
      description: 'A harsh desert filled with dangerous creatures and hidden treasures.',
      npcs: [
        { id: 'npc3', name: 'Desert Nomad', type: 'merchant', level: 30, x: 400, y: 230 },
        { id: 'npc4', name: 'Sand Wraith', type: 'enemy', level: 18, x: 420, y: 250 }
      ],
      resources: [
        { id: 'res3', name: 'Desert Gems', type: 'mineral', rarity: 'rare', respawnTime: 1200, x: 380, y: 220 },
        { id: 'res4', name: 'Cactus Fruit', type: 'herb', rarity: 'common', respawnTime: 400, x: 450, y: 240 }
      ],
      structures: [
        { id: 'str2', name: 'Ancient Pyramid', type: 'dungeon', x: 400, y: 210, width: 60, height: 50, description: 'A mysterious pyramid hiding ancient secrets' }
      ]
    },
    {
      id: '3',
      name: 'Frostbite Peaks',
      biome: 'mountains',
      x: 150,
      y: 300,
      width: 160,
      height: 140,
      level: 25,
      description: 'Treacherous mountain peaks where only the brave dare to venture.',
      npcs: [
        { id: 'npc5', name: 'Mountain Guide', type: 'neutral', level: 35, x: 200, y: 330 },
        { id: 'npc6', name: 'Ice Troll', type: 'enemy', level: 28, x: 220, y: 350 }
      ],
      resources: [
        { id: 'res5', name: 'Iron Ore', type: 'mineral', rarity: 'common', respawnTime: 800, x: 180, y: 320 },
        { id: 'res6', name: 'Mithril Vein', type: 'mineral', rarity: 'epic', respawnTime: 3600, x: 240, y: 360 }
      ],
      structures: [
        { id: 'str3', name: 'Dwarven Mine', type: 'dungeon', x: 190, y: 340, width: 50, height: 40, description: 'An abandoned dwarven mining operation' }
      ]
    }
  ])

  const [layers, setLayers] = useState<WorldLayer[]>([
    { id: '1', name: 'Terrain', visible: true, opacity: 100, type: 'terrain', locked: false },
    { id: '2', name: 'Structures', visible: true, opacity: 100, type: 'objects', locked: false },
    { id: '3', name: 'NPCs', visible: true, opacity: 80, type: 'npcs', locked: false },
    { id: '4', name: 'Resources', visible: true, opacity: 90, type: 'resources', locked: false },
    { id: '5', name: 'Effects', visible: false, opacity: 60, type: 'effects', locked: false }
  ])

  const [newRegion, setNewRegion] = useState({
    name: '',
    biome: 'forest',
    level: 1,
    description: ''
  })

  // Canvas rendering
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
      ctx.scale(zoom, zoom)
      ctx.translate(-cameraX, -cameraY)
      
      // Draw background
      drawBackground(ctx, canvas.width, canvas.height)
      
      // Draw grid if enabled
      if (showGrid) {
        drawGrid(ctx, canvas.width, canvas.height)
      }
      
      // Draw layers in order
      layers.forEach(layer => {
        if (!layer.visible) return
        
        ctx.save()
        ctx.globalAlpha = layer.opacity / 100
        
        switch (layer.type) {
          case 'terrain':
            drawTerrain(ctx)
            break
          case 'objects':
            drawStructures(ctx)
            break
          case 'npcs':
            drawNPCs(ctx)
            break
          case 'resources':
            drawResources(ctx)
            break
          case 'effects':
            drawEffects(ctx)
            break
        }
        
        ctx.restore()
      })
      
      // Draw selection highlight
      if (selectedRegion) {
        const region = worldRegions.find(r => r.id === selectedRegion)
        if (region) {
          drawSelectionHighlight(ctx, region)
        }
      }
      
      // Restore context
      ctx.restore()
      
      // Draw UI overlay
      drawUIOverlay(ctx, canvas.width, canvas.height)
    }

    const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#1e293b')
      gradient.addColorStop(1, '#0f172a')
      ctx.fillStyle = gradient
      ctx.fillRect(-width, -height, width * 3, height * 3)
    }

    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'
      ctx.lineWidth = 1
      
      const gridSize = 50
      const startX = -width * 2
      const startY = -height * 2
      const endX = width * 3
      const endY = height * 3
      
      // Major grid lines
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

      // Minor grid lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      const minorGridSize = gridSize / 5
      for (let x = startX; x < endX; x += minorGridSize) {
        ctx.beginPath()
        ctx.moveTo(x, startY)
        ctx.lineTo(x, endY)
        ctx.stroke()
      }
      
      for (let y = startY; y < endY; y += minorGridSize) {
        ctx.beginPath()
        ctx.moveTo(startX, y)
        ctx.lineTo(endX, y)
        ctx.stroke()
      }
    }

    const drawTerrain = (ctx: CanvasRenderingContext2D) => {
      worldRegions.forEach(region => {
        const biome = biomes.find(b => b.id === region.biome)
        if (!biome) return
        
        // Draw region background
        ctx.fillStyle = biome.color + '40'
        ctx.fillRect(region.x, region.y, region.width, region.height)
        
        // Draw region border
        ctx.strokeStyle = biome.color
        ctx.lineWidth = 2
        ctx.strokeRect(region.x, region.y, region.width, region.height)
        
        // Draw biome pattern
        drawBiomePattern(ctx, region, biome)
        
        // Draw region info
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 14px Inter'
        ctx.fillText(region.name, region.x + 10, region.y + 25)
        
        ctx.fillStyle = biome.color
        ctx.font = '12px Inter'
        ctx.fillText(`Level ${region.level} • ${biome.name}`, region.x + 10, region.y + 45)
        
        // Draw difficulty indicator
        const stars = '★'.repeat(Math.min(biome.difficulty, 5))
        ctx.fillStyle = '#FCD34D'
        ctx.fillText(stars, region.x + 10, region.y + region.height - 10)
      })
    }

    const drawBiomePattern = (ctx: CanvasRenderingContext2D, region: WorldRegion, biome: Biome) => {
      ctx.save()
      ctx.globalAlpha = 0.4
      ctx.fillStyle = biome.color
      
      const patternDensity = Math.floor((region.width * region.height) / 2000)
      
      for (let i = 0; i < patternDensity; i++) {
        const x = region.x + Math.random() * region.width
        const y = region.y + Math.random() * region.height
        
        switch (biome.id) {
          case 'forest':
            // Trees
            ctx.beginPath()
            ctx.arc(x, y, 3 + Math.random() * 4, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillRect(x - 1, y, 2, 8)
            break
            
          case 'desert':
            // Sand dunes and cacti
            if (Math.random() > 0.7) {
              ctx.fillRect(x - 2, y - 8, 4, 12)
              ctx.fillRect(x - 6, y - 4, 4, 2)
              ctx.fillRect(x + 2, y - 6, 4, 2)
            } else {
              ctx.beginPath()
              ctx.arc(x, y, 8, 0, Math.PI)
              ctx.fill()
            }
            break
            
          case 'mountains':
            // Mountain peaks
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + 8, y - 12)
            ctx.lineTo(x + 16, y)
            ctx.closePath()
            ctx.fill()
            break
            
          case 'ocean':
            // Waves
            ctx.beginPath()
            for (let j = 0; j < 20; j += 4) {
              ctx.quadraticCurveTo(x + j + 2, y - 2, x + j + 4, y)
            }
            ctx.stroke()
            break
            
          case 'tundra':
            // Ice crystals
            ctx.fillRect(x - 1, y - 1, 3, 3)
            ctx.fillRect(x - 2, y, 1, 1)
            ctx.fillRect(x + 2, y, 1, 1)
            break
            
          case 'volcanic':
            // Lava bubbles
            ctx.fillStyle = '#FF4500'
            ctx.beginPath()
            ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2)
            ctx.fill()
            break
        }
      }
      
      ctx.restore()
    }

    const drawStructures = (ctx: CanvasRenderingContext2D) => {
      worldRegions.forEach(region => {
        region.structures.forEach(structure => {
          ctx.fillStyle = '#6B7280'
          ctx.fillRect(structure.x, structure.y, structure.width, structure.height)
          
          // Structure type indicator
          ctx.fillStyle = '#FFFFFF'
          ctx.font = '10px Inter'
          ctx.fillText(structure.name, structure.x + 2, structure.y + 12)
          
          // Type icon
          const iconColor = structure.type === 'dungeon' ? '#DC2626' : 
                           structure.type === 'portal' ? '#8B5CF6' : '#10B981'
          ctx.fillStyle = iconColor
          ctx.fillRect(structure.x + structure.width - 8, structure.y + 2, 6, 6)
        })
      })
    }

    const drawNPCs = (ctx: CanvasRenderingContext2D) => {
      worldRegions.forEach(region => {
        region.npcs.forEach(npc => {
          const color = npc.type === 'enemy' ? '#DC2626' :
                       npc.type === 'merchant' ? '#F59E0B' :
                       npc.type === 'quest_giver' ? '#8B5CF6' :
                       npc.type === 'guard' ? '#10B981' : '#6B7280'
          
          // NPC body
          ctx.fillStyle = color
          ctx.fillRect(npc.x - 4, npc.y - 6, 8, 12)
          
          // NPC head
          ctx.fillStyle = '#FBBF24'
          ctx.fillRect(npc.x - 3, npc.y - 10, 6, 6)
          
          // Level indicator
          ctx.fillStyle = '#FFFFFF'
          ctx.font = '8px Inter'
          ctx.fillText(npc.level.toString(), npc.x - 2, npc.y + 8)
          
          // Name label
          ctx.font = '9px Inter'
          ctx.fillText(npc.name, npc.x - 15, npc.y - 12)
        })
      })
    }

    const drawResources = (ctx: CanvasRenderingContext2D) => {
      worldRegions.forEach(region => {
        region.resources.forEach(resource => {
          const color = resource.rarity === 'legendary' ? '#8B5CF6' :
                       resource.rarity === 'epic' ? '#DC2626' :
                       resource.rarity === 'rare' ? '#F59E0B' :
                       resource.rarity === 'uncommon' ? '#10B981' : '#6B7280'
          
          // Resource node
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(resource.x, resource.y, 4, 0, Math.PI * 2)
          ctx.fill()
          
          // Glow effect for rare resources
          if (resource.rarity !== 'common') {
            ctx.save()
            ctx.globalAlpha = 0.3
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(resource.x, resource.y, 8, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }
          
          // Resource name
          ctx.fillStyle = '#FFFFFF'
          ctx.font = '8px Inter'
          ctx.fillText(resource.name, resource.x - 10, resource.y - 8)
        })
      })
    }

    const drawEffects = (ctx: CanvasRenderingContext2D) => {
      // Weather effects, particles, etc.
      worldRegions.forEach(region => {
        const biome = biomes.find(b => b.id === region.biome)
        if (!biome) return
        
        // Add weather effects based on biome
        if (biome.id === 'tundra') {
          // Snow particles
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          for (let i = 0; i < 20; i++) {
            const x = region.x + Math.random() * region.width
            const y = region.y + Math.random() * region.height
            ctx.fillRect(x, y, 1, 1)
          }
        } else if (biome.id === 'volcanic') {
          // Ember particles
          ctx.fillStyle = 'rgba(255, 69, 0, 0.8)'
          for (let i = 0; i < 15; i++) {
            const x = region.x + Math.random() * region.width
            const y = region.y + Math.random() * region.height
            ctx.beginPath()
            ctx.arc(x, y, 1, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })
    }

    const drawSelectionHighlight = (ctx: CanvasRenderingContext2D, region: WorldRegion) => {
      ctx.strokeStyle = '#8B5CF6'
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])
      ctx.strokeRect(region.x - 5, region.y - 5, region.width + 10, region.height + 10)
      ctx.setLineDash([])
    }

    const drawUIOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Tool indicator
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(10, 10, 150, 30)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '12px Inter'
      ctx.fillText(`Tool: ${selectedTool}`, 20, 30)
      
      // Coordinates
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(width - 160, 10, 150, 50)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(`Camera: (${cameraX.toFixed(0)}, ${cameraY.toFixed(0)})`, width - 150, 30)
      ctx.fillText(`Zoom: ${(zoom * 100).toFixed(0)}%`, width - 150, 50)
    }

    render()
  }, [worldRegions, biomes, showGrid, zoom, cameraX, cameraY, selectedRegion, layers, selectedTool])

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - canvas.width / 2) / zoom + cameraX
    const y = (e.clientY - rect.top - canvas.height / 2) / zoom + cameraY

    if (selectedTool === 'select') {
      // Find clicked region
      const clickedRegion = worldRegions.find(region => 
        x >= region.x && x <= region.x + region.width &&
        y >= region.y && y <= region.y + region.height
      )
      setSelectedRegion(clickedRegion?.id || null)
    }
  }, [zoom, cameraX, cameraY, selectedTool, worldRegions])

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

  const toggleLayerLock = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ))
  }

  const addNewRegion = () => {
    if (!newRegion.name.trim()) return

    const region: WorldRegion = {
      id: Date.now().toString(),
      name: newRegion.name,
      biome: newRegion.biome,
      x: cameraX,
      y: cameraY,
      width: 150,
      height: 100,
      level: newRegion.level,
      description: newRegion.description,
      npcs: [],
      resources: [],
      structures: []
    }

    setWorldRegions(prev => [...prev, region])
    setNewRegion({ name: '', biome: 'forest', level: 1, description: '' })
    setSelectedRegion(region.id)
  }

  const deleteRegion = (regionId: string) => {
    setWorldRegions(prev => prev.filter(r => r.id !== regionId))
    if (selectedRegion === regionId) {
      setSelectedRegion(null)
    }
  }

  const exportWorldData = () => {
    const worldData = {
      regions: worldRegions,
      biomes: biomes,
      layers: layers,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0'
      }
    }
    
    const dataStr = JSON.stringify(worldData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'world_data.json'
    link.click()
    
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Tools */}
      <div className="w-64 border-r border-border bg-card/50 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">World Builder</h3>
            
            <div className="space-y-2">
              <Label>Tools</Label>
              <div className="grid grid-cols-2 gap-1">
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
                  variant={selectedTool === 'npc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('npc')}
                >
                  <Users className="w-3 h-3 mr-1" />
                  NPC
                </Button>
                <Button
                  variant={selectedTool === 'resource' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('resource')}
                >
                  <Gem className="w-3 h-3 mr-1" />
                  Resource
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Biomes</Label>
            <div className="grid gap-1 mt-2">
              {biomes.map(biome => (
                <Button
                  key={biome.id}
                  variant={selectedBiome === biome.id ? 'default' : 'outline'}
                  className="justify-start text-xs p-2"
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
              max={100}
              step={5}
              className="mt-2"
            />
            <div className="text-sm text-muted-foreground mt-1">{brushSize}px</div>
          </div>

          <div>
            <Label>Camera Controls</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.min(prev * 1.2, 3))}
              >
                Zoom In
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.3))}
              >
                Zoom Out
              </Button>
            </div>
            <Slider
              value={[zoom * 100]}
              onValueChange={([value]) => setZoom(value / 100)}
              min={30}
              max={300}
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

          <div className="space-y-2">
            <Button onClick={exportWorldData} variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export World
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={1000}
          height={700}
          className="w-full h-full bg-slate-900 cursor-crosshair"
          onClick={handleCanvasClick}
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
              <Button variant="ghost" size="sm">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Sidebar - Layers & Properties */}
      <div className="w-80 border-l border-border bg-card/50 p-4 overflow-y-auto">
        <Tabs defaultValue="layers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLayerLock(layer.id)}
                        className="p-0 h-6 w-6"
                      >
                        {layer.locked ? <Shield className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                      </Button>
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
                      disabled={layer.locked}
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
              <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-1" />
                {isEditing ? 'Done' : 'Edit'}
              </Button>
            </div>
            
            <div className="space-y-3">
              {worldRegions.map(region => {
                const biome = biomes.find(b => b.id === region.biome)
                return (
                  <Card 
                    key={region.id} 
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedRegion === region.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRegion(region.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: biome?.color }}
                        />
                        <span className="font-medium text-sm">{region.name}</span>
                      </div>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteRegion(region.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Biome:</span>
                        <span className="capitalize">{biome?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Level:</span>
                        <span>{region.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{region.width}×{region.height}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">NPCs:</span>
                        <span>{region.npcs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resources:</span>
                        <span>{region.resources.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Structures:</span>
                        <span>{region.structures.length}</span>
                      </div>
                      
                      {region.description && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          {region.description}
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <h4 className="font-medium">Create New Region</h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="regionName">Region Name</Label>
                <Input
                  id="regionName"
                  value={newRegion.name}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter region name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="regionBiome">Biome</Label>
                <Select 
                  value={newRegion.biome} 
                  onValueChange={(value) => setNewRegion(prev => ({ ...prev, biome: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {biomes.map(biome => (
                      <SelectItem key={biome.id} value={biome.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: biome.color }}
                          />
                          <span>{biome.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="regionLevel">Level Range</Label>
                <Input
                  id="regionLevel"
                  type="number"
                  value={newRegion.level}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, level: Number(e.target.value) }))}
                  min="1"
                  max="100"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="regionDescription">Description</Label>
                <Textarea
                  id="regionDescription"
                  value={newRegion.description}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this region..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={addNewRegion} 
                disabled={!newRegion.name.trim()}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Region
              </Button>
            </div>
            
            {selectedRegion && (() => {
              const region = worldRegions.find(r => r.id === selectedRegion)
              const biome = biomes.find(b => b.id === region?.biome)
              if (!region || !biome) return null
              
              return (
                <Card className="p-4 mt-4">
                  <h5 className="font-medium mb-3">Selected Region</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{region.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Biome:</span>
                      <span>{biome.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span>{'★'.repeat(biome.difficulty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span>{biome.temperature}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Humidity:</span>
                      <span>{biome.humidity}%</span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-muted-foreground mb-1">Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {biome.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-muted-foreground mb-1">Resources:</div>
                      <div className="flex flex-wrap gap-1">
                        {biome.resources.map(resource => (
                          <Badge key={resource} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}