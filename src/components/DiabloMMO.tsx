import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { CharacterCreator } from './CharacterCreator'
import { WorldGenerator } from './WorldGenerator'
import { 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Coins, 
  Package,
  Users,
  Map,
  Settings,
  Download,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  UserPlus,
  Globe
} from 'lucide-react'

interface Player {
  id: string
  name: string
  class: 'Barbarian' | 'Sorceress' | 'Necromancer' | 'Paladin' | 'Amazon' | 'Assassin' | 'Druid'
  level: number
  experience: number
  experienceToNext: number
  stats: {
    health: number
    maxHealth: number
    mana: number
    maxMana: number
    strength: number
    dexterity: number
    vitality: number
    energy: number
  }
  position: { x: number; y: number }
  inventory: Item[]
  equipment: Equipment
  skills: Skill[]
  gold: number
}

interface Item {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'helmet' | 'boots' | 'gloves' | 'ring' | 'amulet' | 'potion' | 'scroll'
  rarity: 'normal' | 'magic' | 'rare' | 'unique' | 'set'
  stats: { [key: string]: number }
  requirements: { level?: number; strength?: number; dexterity?: number }
  socketCount?: number
  durability?: { current: number; max: number }
}

interface Equipment {
  weapon?: Item
  armor?: Item
  helmet?: Item
  boots?: Item
  gloves?: Item
  ring1?: Item
  ring2?: Item
  amulet?: Item
}

interface Skill {
  id: string
  name: string
  level: number
  maxLevel: number
  description: string
  manaCost: number
  cooldown: number
  damage?: number
  type: 'active' | 'passive'
}

interface Monster {
  id: string
  name: string
  type: string
  level: number
  health: number
  maxHealth: number
  position: { x: number; y: number }
  damage: number
  experience: number
  loot: Item[]
  isElite: boolean
  immunities: string[]
}

interface GameWorld {
  name: string
  biome: 'forest' | 'desert' | 'caves' | 'hell' | 'ice' | 'swamp'
  level: number
  monsters: Monster[]
  npcs: NPC[]
  waypoints: Waypoint[]
  quests: Quest[]
}

interface NPC {
  id: string
  name: string
  type: 'merchant' | 'quest_giver' | 'blacksmith' | 'healer'
  position: { x: number; y: number }
  dialogue: string[]
  services: string[]
}

interface Waypoint {
  id: string
  name: string
  position: { x: number; y: number }
  unlocked: boolean
}

interface Quest {
  id: string
  name: string
  description: string
  objectives: string[]
  rewards: { experience: number; gold: number; items: Item[] }
  completed: boolean
}

export function DiabloMMO() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [camera, setCamera] = useState({ x: 400, y: 300, zoom: 1 })
  const [selectedTab, setSelectedTab] = useState('game')
  const [showCharacterCreator, setShowCharacterCreator] = useState(false)
  const [showWorldGenerator, setShowWorldGenerator] = useState(false)
  
  // Game state
  const [player, setPlayer] = useState<Player>({
    id: '1',
    name: 'Hero',
    class: 'Barbarian',
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    stats: {
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      strength: 25,
      dexterity: 15,
      vitality: 20,
      energy: 10
    },
    position: { x: 400, y: 300 },
    inventory: [],
    equipment: {},
    skills: [
      {
        id: '1',
        name: 'Bash',
        level: 1,
        maxLevel: 20,
        description: 'A powerful melee attack',
        manaCost: 2,
        cooldown: 1000,
        damage: 15,
        type: 'active'
      }
    ],
    gold: 100
  })

  const [currentWorld, setCurrentWorld] = useState<GameWorld>({
    name: 'Blood Moor',
    biome: 'forest',
    level: 1,
    monsters: [
      {
        id: '1',
        name: 'Fallen',
        type: 'demon',
        level: 1,
        health: 25,
        maxHealth: 25,
        position: { x: 500, y: 200 },
        damage: 8,
        experience: 50,
        loot: [],
        isElite: false,
        immunities: []
      },
      {
        id: '2',
        name: 'Zombie',
        type: 'undead',
        level: 2,
        health: 40,
        maxHealth: 40,
        position: { x: 300, y: 400 },
        damage: 12,
        experience: 75,
        loot: [],
        isElite: false,
        immunities: ['poison']
      }
    ],
    npcs: [
      {
        id: '1',
        name: 'Kashya',
        type: 'quest_giver',
        position: { x: 100, y: 100 },
        dialogue: ['Welcome to the Rogue Encampment, warrior.'],
        services: ['quests']
      }
    ],
    waypoints: [
      {
        id: '1',
        name: 'Rogue Encampment',
        position: { x: 50, y: 50 },
        unlocked: true
      }
    ],
    quests: [
      {
        id: '1',
        name: 'Den of Evil',
        description: 'Clear the cave of evil creatures',
        objectives: ['Kill all monsters in the Den'],
        rewards: { experience: 500, gold: 200, items: [] },
        completed: false
      }
    ]
  })

  const [exportData, setExportData] = useState<any>(null)

  const handleCharacterCreated = (newCharacter: any) => {
    setPlayer(newCharacter)
    setShowCharacterCreator(false)
  }

  const handleCancelCharacterCreation = () => {
    setShowCharacterCreator(false)
  }

  const handleCancelWorldGeneration = () => {
    setShowWorldGenerator(false)
  }

  // Game rendering
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
      
      // Apply camera
      ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2)
      ctx.scale(camera.zoom, camera.zoom)
      
      // Draw world background
      drawWorldBackground(ctx)
      
      // Draw waypoints
      currentWorld.waypoints.forEach(waypoint => {
        if (waypoint.unlocked) {
          drawWaypoint(ctx, waypoint)
        }
      })
      
      // Draw NPCs
      currentWorld.npcs.forEach(npc => {
        drawNPC(ctx, npc)
      })
      
      // Draw monsters
      currentWorld.monsters.forEach(monster => {
        drawMonster(ctx, monster)
      })
      
      // Draw player
      drawPlayer(ctx, player)
      
      // Restore context
      ctx.restore()
      
      // Draw UI
      drawUI(ctx, canvas.width, canvas.height)
    }

    const drawWorldBackground = (ctx: CanvasRenderingContext2D) => {
      // Draw biome-specific background
      const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 600)
      
      switch (currentWorld.biome) {
        case 'forest':
          gradient.addColorStop(0, '#2D5016')
          gradient.addColorStop(1, '#1A2E0A')
          break
        case 'desert':
          gradient.addColorStop(0, '#8B4513')
          gradient.addColorStop(1, '#654321')
          break
        case 'caves':
          gradient.addColorStop(0, '#2F2F2F')
          gradient.addColorStop(1, '#1A1A1A')
          break
        case 'hell':
          gradient.addColorStop(0, '#8B0000')
          gradient.addColorStop(1, '#4B0000')
          break
        default:
          gradient.addColorStop(0, '#2D5016')
          gradient.addColorStop(1, '#1A2E0A')
      }
      
      ctx.fillStyle = gradient
      ctx.fillRect(-1000, -1000, 2000, 2000)
      
      // Draw terrain details
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 800
        const y = Math.random() * 600
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.beginPath()
        ctx.arc(x, y, Math.random() * 5 + 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
      const { x, y } = player.position
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.ellipse(x, y + 15, 8, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Body based on class
      switch (player.class) {
        case 'Barbarian':
          ctx.fillStyle = '#8B4513'
          ctx.fillRect(x - 6, y - 10, 12, 20)
          ctx.fillStyle = '#D2691E'
          ctx.fillRect(x - 4, y - 15, 8, 8)
          break
        case 'Sorceress':
          ctx.fillStyle = '#4B0082'
          ctx.fillRect(x - 5, y - 10, 10, 20)
          ctx.fillStyle = '#FFB6C1'
          ctx.fillRect(x - 3, y - 15, 6, 8)
          break
        case 'Necromancer':
          ctx.fillStyle = '#2F4F4F'
          ctx.fillRect(x - 5, y - 10, 10, 20)
          ctx.fillStyle = '#F5F5DC'
          ctx.fillRect(x - 3, y - 15, 6, 8)
          break
        default:
          ctx.fillStyle = '#8B4513'
          ctx.fillRect(x - 6, y - 10, 12, 20)
          ctx.fillStyle = '#D2691E'
          ctx.fillRect(x - 4, y - 15, 8, 8)
      }
      
      // Health bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(x - 15, y - 25, 30, 4)
      ctx.fillStyle = '#DC2626'
      ctx.fillRect(x - 15, y - 25, (player.stats.health / player.stats.maxHealth) * 30, 4)
      
      // Name
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(player.name, x, y - 30)
    }

    const drawMonster = (ctx: CanvasRenderingContext2D, monster: Monster) => {
      const { x, y } = monster.position
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.ellipse(x, y + 12, 6, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Monster body based on type
      switch (monster.type) {
        case 'demon':
          ctx.fillStyle = monster.isElite ? '#8B0000' : '#DC143C'
          ctx.fillRect(x - 4, y - 8, 8, 16)
          // Horns
          ctx.fillStyle = '#2F2F2F'
          ctx.fillRect(x - 2, y - 12, 1, 4)
          ctx.fillRect(x + 1, y - 12, 1, 4)
          break
        case 'undead':
          ctx.fillStyle = monster.isElite ? '#4B0082' : '#9ACD32'
          ctx.fillRect(x - 4, y - 8, 8, 16)
          break
        default:
          ctx.fillStyle = '#8B4513'
          ctx.fillRect(x - 4, y - 8, 8, 16)
      }
      
      // Health bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(x - 12, y - 18, 24, 3)
      ctx.fillStyle = monster.isElite ? '#FFD700' : '#DC2626'
      ctx.fillRect(x - 12, y - 18, (monster.health / monster.maxHealth) * 24, 3)
      
      // Name
      ctx.fillStyle = monster.isElite ? '#FFD700' : '#FFFFFF'
      ctx.font = '8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(monster.name, x, y - 22)
    }

    const drawNPC = (ctx: CanvasRenderingContext2D, npc: NPC) => {
      const { x, y } = npc.position
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.ellipse(x, y + 12, 6, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // NPC body
      ctx.fillStyle = '#4169E1'
      ctx.fillRect(x - 4, y - 8, 8, 16)
      ctx.fillStyle = '#FFB6C1'
      ctx.fillRect(x - 3, y - 12, 6, 6)
      
      // Quest indicator
      if (npc.type === 'quest_giver') {
        ctx.fillStyle = '#FFD700'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('!', x, y - 15)
      }
      
      // Name
      ctx.fillStyle = '#00FFFF'
      ctx.font = '8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(npc.name, x, y - 20)
    }

    const drawWaypoint = (ctx: CanvasRenderingContext2D, waypoint: Waypoint) => {
      const { x, y } = waypoint.position
      
      // Waypoint portal
      ctx.fillStyle = '#00BFFF'
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
      
      // Inner glow
      ctx.fillStyle = '#87CEEB'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
      
      // Name
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(waypoint.name, x, y - 15)
    }

    const drawUI = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Mini-map
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(width - 150, 10, 140, 140)
      ctx.strokeStyle = '#8B5CF6'
      ctx.strokeRect(width - 150, 10, 140, 140)
      
      // Player dot on minimap
      ctx.fillStyle = '#00FF00'
      ctx.beginPath()
      ctx.arc(width - 80, 80, 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Monsters on minimap
      currentWorld.monsters.forEach(monster => {
        ctx.fillStyle = monster.isElite ? '#FFD700' : '#FF0000'
        ctx.beginPath()
        ctx.arc(
          width - 150 + (monster.position.x / 800) * 140,
          10 + (monster.position.y / 600) * 140,
          1,
          0,
          Math.PI * 2
        )
        ctx.fill()
      })
    }

    if (isPlaying) {
      const gameLoop = setInterval(render, 16) // 60 FPS
      return () => clearInterval(gameLoop)
    } else {
      render()
    }
  }, [isPlaying, camera, player, currentWorld])

  const handlePlayerMove = useCallback((direction: string) => {
    if (!isPlaying) return
    
    setPlayer(prev => {
      const speed = 3
      let newX = prev.position.x
      let newY = prev.position.y
      
      switch (direction) {
        case 'up':
          newY -= speed
          break
        case 'down':
          newY += speed
          break
        case 'left':
          newX -= speed
          break
        case 'right':
          newX += speed
          break
      }
      
      return {
        ...prev,
        position: { x: newX, y: newY }
      }
    })
    
    // Update camera to follow player
    setCamera(prev => ({
      ...prev,
      x: player.position.x,
      y: player.position.y
    }))
  }, [isPlaying, player.position])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          handlePlayerMove('up')
          break
        case 's':
        case 'arrowdown':
          handlePlayerMove('down')
          break
        case 'a':
        case 'arrowleft':
          handlePlayerMove('left')
          break
        case 'd':
        case 'arrowright':
          handlePlayerMove('right')
          break
      }
    }

    if (isPlaying) {
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isPlaying, handlePlayerMove])

  const generateUnrealExport = () => {
    const unrealData = {
      GameSettings: {
        GameMode: 'DiabloMMO',
        MaxPlayers: 8,
        WorldSize: { X: 8000, Y: 6000 },
        SpawnPoints: currentWorld.waypoints.map(wp => ({
          Name: wp.name,
          Location: { X: wp.position.x * 10, Y: wp.position.y * 10, Z: 0 }
        }))
      },
      PlayerClasses: [
        {
          ClassName: 'Barbarian',
          BaseStats: { Health: 100, Mana: 50, Strength: 25, Dexterity: 15 },
          StartingSkills: ['Bash', 'Shout'],
          MeshPath: '/Game/Characters/Barbarian/BP_Barbarian'
        },
        {
          ClassName: 'Sorceress',
          BaseStats: { Health: 60, Mana: 100, Strength: 10, Dexterity: 20 },
          StartingSkills: ['Fireball', 'Teleport'],
          MeshPath: '/Game/Characters/Sorceress/BP_Sorceress'
        }
      ],
      Monsters: currentWorld.monsters.map(monster => ({
        Name: monster.name,
        Type: monster.type,
        Level: monster.level,
        Health: monster.maxHealth,
        Damage: monster.damage,
        SpawnLocation: { X: monster.position.x * 10, Y: monster.position.y * 10, Z: 0 },
        AIBehavior: monster.isElite ? 'Elite' : 'Normal',
        LootTable: monster.loot.map(item => item.name),
        MeshPath: `/Game/Monsters/${monster.type}/BP_${monster.name}`
      })),
      WorldData: {
        BiomeType: currentWorld.biome,
        LevelRange: [currentWorld.level, currentWorld.level + 5],
        TerrainMaterial: `/Game/Materials/Terrain/${currentWorld.biome}`,
        AmbientSound: `/Game/Audio/Ambient/${currentWorld.biome}`,
        LightingPreset: currentWorld.biome === 'hell' ? 'Dark' : 'Normal'
      },
      NPCs: currentWorld.npcs.map(npc => ({
        Name: npc.name,
        Type: npc.type,
        Location: { X: npc.position.x * 10, Y: npc.position.y * 10, Z: 0 },
        Dialogue: npc.dialogue,
        Services: npc.services,
        MeshPath: `/Game/NPCs/${npc.type}/BP_${npc.name}`
      })),
      Quests: currentWorld.quests.map(quest => ({
        QuestID: quest.id,
        Name: quest.name,
        Description: quest.description,
        Objectives: quest.objectives,
        Rewards: quest.rewards,
        QuestGiver: currentWorld.npcs.find(npc => npc.type === 'quest_giver')?.name
      })),
      ItemDatabase: [
        {
          ItemID: 'sword_001',
          Name: 'Iron Sword',
          Type: 'weapon',
          Rarity: 'normal',
          Stats: { Damage: 15, Durability: 100 },
          MeshPath: '/Game/Items/Weapons/Swords/BP_IronSword'
        }
      ],
      SkillSystem: {
        SkillTrees: {
          Barbarian: [
            {
              SkillName: 'Bash',
              MaxLevel: 20,
              ManaCost: 2,
              Damage: 15,
              Prerequisites: [],
              EffectPath: '/Game/Effects/Skills/Barbarian/FX_Bash'
            }
          ]
        }
      }
    }
    
    setExportData(unrealData)
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(unrealData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'DiabloMMO_UnrealExport.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Show character creator if requested
  if (showCharacterCreator) {
    return (
      <CharacterCreator 
        onCharacterCreated={handleCharacterCreated}
        onCancel={handleCancelCharacterCreation}
      />
    )
  }

  // Show world generator if requested
  if (showWorldGenerator) {
    return (
      <WorldGenerator />
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-red-950 via-black to-orange-950">
      {/* Game Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 border-b border-red-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-red-400">Diablo II MMO</h1>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            {currentWorld.name} - Level {currentWorld.level}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={isPlaying ? "destructive" : "default"}
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-red-700 hover:bg-red-600"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowCharacterCreator(true)}
            className="border-blue-600 text-blue-400 hover:bg-blue-900"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            New Character
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowWorldGenerator(true)}
            className="border-green-600 text-green-400 hover:bg-green-900"
          >
            <Globe className="w-4 h-4 mr-2" />
            World Generator
          </Button>
          
          <Button
            variant="outline"
            onClick={generateUnrealExport}
            className="border-orange-600 text-orange-400 hover:bg-orange-900"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to UE5
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Game Viewport */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full bg-black border border-red-800"
          />
          
          {/* Game Controls */}
          <div className="absolute top-4 left-4 space-y-2">
            <Card className="p-2 bg-black/80 border-red-800">
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" onClick={() => setCamera(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setCamera(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.5) }))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setCamera({ x: player.position.x, y: player.position.y, zoom: 1 })}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Player Stats HUD */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-4 bg-black/90 border-red-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-xs text-red-400">Health</div>
                    <Progress 
                      value={(player.stats.health / player.stats.maxHealth) * 100} 
                      className="w-24 h-2 bg-red-950"
                    />
                    <div className="text-xs text-white">{player.stats.health}/{player.stats.maxHealth}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-blue-400">Mana</div>
                    <Progress 
                      value={(player.stats.mana / player.stats.maxMana) * 100} 
                      className="w-24 h-2 bg-blue-950"
                    />
                    <div className="text-xs text-white">{player.stats.mana}/{player.stats.maxMana}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-yellow-400">Experience</div>
                    <Progress 
                      value={(player.experience / player.experienceToNext) * 100} 
                      className="w-32 h-2 bg-yellow-950"
                    />
                    <div className="text-xs text-white">Level {player.level}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-yellow-400">
                    <Coins className="w-4 h-4 mr-1" />
                    {player.gold}
                  </div>
                  <div className="text-white">
                    {player.class}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-black/50 border-l border-red-800">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4 bg-red-950">
              <TabsTrigger value="game" className="text-xs">Game</TabsTrigger>
              <TabsTrigger value="inventory" className="text-xs">Items</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
              <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
            </TabsList>

            <div className="p-4 h-full overflow-y-auto">
              <TabsContent value="game" className="space-y-4">
                <Card className="p-3 bg-red-950/50 border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2">Character Stats</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Strength: {player.stats.strength}</div>
                    <div>Dexterity: {player.stats.dexterity}</div>
                    <div>Vitality: {player.stats.vitality}</div>
                    <div>Energy: {player.stats.energy}</div>
                  </div>
                </Card>

                <Card className="p-3 bg-red-950/50 border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2">Current Quest</h4>
                  {currentWorld.quests.filter(q => !q.completed).map(quest => (
                    <div key={quest.id} className="text-sm">
                      <div className="font-medium text-yellow-400">{quest.name}</div>
                      <div className="text-gray-300 text-xs">{quest.description}</div>
                      <div className="mt-1">
                        {quest.objectives.map((obj, i) => (
                          <div key={i} className="text-xs text-gray-400">• {obj}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Card>

                <Card className="p-3 bg-red-950/50 border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2">Nearby Enemies</h4>
                  <div className="space-y-1">
                    {currentWorld.monsters.map(monster => (
                      <div key={monster.id} className="flex justify-between text-xs">
                        <span className={monster.isElite ? 'text-yellow-400' : 'text-white'}>
                          {monster.name}
                        </span>
                        <span className="text-gray-400">Lv.{monster.level}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <Card className="p-3 bg-red-950/50 border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2">Equipment</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['helmet', 'armor', 'weapon', 'gloves', 'boots', 'ring1'].map(slot => (
                      <div key={slot} className="aspect-square border border-red-700 bg-red-900/30 rounded flex items-center justify-center text-xs text-gray-400">
                        {slot}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-3 bg-red-950/50 border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2">Inventory</h4>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="aspect-square border border-red-700 bg-red-900/30 rounded"></div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card className="p-3 bg-red-950/50 border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2">Skill Tree - {player.class}</h4>
                  <div className="space-y-2">
                    {player.skills.map(skill => (
                      <div key={skill.id} className="border border-red-700 p-2 rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-yellow-400">{skill.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {skill.level}/{skill.maxLevel}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-300 mt-1">{skill.description}</div>
                        <div className="text-xs text-blue-400 mt-1">
                          Mana: {skill.manaCost} | Damage: {skill.damage}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <Card className="p-3 bg-red-950/50 border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2">Unreal Engine 5 Export</h4>
                  <div className="space-y-3">
                    <Button 
                      onClick={generateUnrealExport}
                      className="w-full bg-orange-700 hover:bg-orange-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate UE5 Export
                    </Button>
                    
                    <div className="text-xs text-gray-300">
                      <p>Export includes:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Character classes & stats</li>
                        <li>Monster spawns & AI</li>
                        <li>World data & biomes</li>
                        <li>Quest system</li>
                        <li>Item database</li>
                        <li>Skill trees</li>
                        <li>NPC dialogue</li>
                      </ul>
                    </div>
                    
                    {exportData && (
                      <div className="text-xs text-green-400">
                        ✓ Export generated successfully!
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-3 bg-red-950/50 border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2">Game Statistics</h4>
                  <div className="text-xs space-y-1">
                    <div>Monsters: {currentWorld.monsters.length}</div>
                    <div>NPCs: {currentWorld.npcs.length}</div>
                    <div>Quests: {currentWorld.quests.length}</div>
                    <div>Waypoints: {currentWorld.waypoints.length}</div>
                    <div>Player Level: {player.level}</div>
                    <div>World: {currentWorld.name}</div>
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Controls Help */}
      <div className="p-2 bg-black/50 border-t border-red-800 text-xs text-gray-400 text-center">
        Controls: WASD or Arrow Keys to move | Click monsters to attack | Visit NPCs for quests
      </div>
    </div>
  )
}