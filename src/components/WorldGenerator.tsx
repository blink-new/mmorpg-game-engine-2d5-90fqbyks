import React, { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Trees, 
  Mountain, 
  Flame, 
  Snowflake, 
  Droplets,
  Skull,
  Castle,
  Users,
  Coins,
  Sword,
  Shield,
  Download
} from 'lucide-react'

interface BiomeData {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  difficulty: number
  levelRange: [number, number]
  monsterTypes: string[]
  resources: string[]
  weatherEffects: string[]
  ambientSounds: string[]
}

interface GeneratedArea {
  id: string
  name: string
  biome: BiomeData
  size: { width: number; height: number }
  monsters: any[]
  npcs: any[]
  loot: any[]
  quests: any[]
  waypoints: any[]
  specialFeatures: string[]
}

export function WorldGenerator() {
  const [selectedBiome, setSelectedBiome] = useState<BiomeData | null>(null)
  const [generatedAreas, setGeneratedAreas] = useState<GeneratedArea[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const biomes: BiomeData[] = [
    {
      id: 'rogue_encampment',
      name: 'Rogue Encampment',
      description: 'The starting area where heroes begin their journey. A safe haven with merchants and quest givers.',
      icon: <Castle className="w-6 h-6" />,
      color: '#8B4513',
      difficulty: 1,
      levelRange: [1, 5],
      monsterTypes: ['Fallen', 'Zombies', 'Quill Rats'],
      resources: ['Wood', 'Stone', 'Herbs'],
      weatherEffects: ['Clear', 'Light Rain'],
      ambientSounds: ['Birds', 'Wind', 'Campfire']
    },
    {
      id: 'blood_moor',
      name: 'Blood Moor',
      description: 'Dark grasslands corrupted by evil forces. The first real challenge for new heroes.',
      icon: <Trees className="w-6 h-6" />,
      color: '#2D5016',
      difficulty: 2,
      levelRange: [1, 8],
      monsterTypes: ['Fallen', 'Zombies', 'Gargantuan Beast'],
      resources: ['Corrupted Wood', 'Dark Herbs', 'Monster Parts'],
      weatherEffects: ['Fog', 'Blood Rain', 'Dark Clouds'],
      ambientSounds: ['Howling', 'Rustling Leaves', 'Distant Screams']
    },
    {
      id: 'cold_plains',
      name: 'Cold Plains',
      description: 'Frozen wastelands where the cold bites deep and undead roam freely.',
      icon: <Snowflake className="w-6 h-6" />,
      color: '#4682B4',
      difficulty: 3,
      levelRange: [5, 12],
      monsterTypes: ['Fallen Shaman', 'Skeleton', 'Brute'],
      resources: ['Ice Crystals', 'Frozen Meat', 'Cold Iron'],
      weatherEffects: ['Blizzard', 'Frost', 'Ice Storm'],
      ambientSounds: ['Howling Wind', 'Cracking Ice', 'Undead Moans']
    },
    {
      id: 'stony_field',
      name: 'Stony Field',
      description: 'Rocky terrain filled with ancient ruins and powerful monsters.',
      icon: <Mountain className="w-6 h-6" />,
      color: '#696969',
      difficulty: 4,
      levelRange: [8, 15],
      monsterTypes: ['Skeleton Archer', 'Dark Ranger', 'Stone Golem'],
      resources: ['Stone', 'Ancient Runes', 'Precious Metals'],
      weatherEffects: ['Dust Storm', 'Clear', 'Thunderstorm'],
      ambientSounds: ['Falling Rocks', 'Echo', 'Ancient Whispers']
    },
    {
      id: 'underground_passage',
      name: 'Underground Passage',
      description: 'Dark tunnels beneath the earth, home to creatures that fear the light.',
      icon: <Skull className="w-6 h-6" />,
      color: '#2F2F2F',
      difficulty: 5,
      levelRange: [10, 18],
      monsterTypes: ['Cave Leaper', 'Plague Bearer', 'Bone Warrior'],
      resources: ['Mushrooms', 'Cave Crystals', 'Bone Fragments'],
      weatherEffects: ['Darkness', 'Dripping Water', 'Toxic Gas'],
      ambientSounds: ['Dripping', 'Scurrying', 'Echoing Footsteps']
    },
    {
      id: 'burning_hell',
      name: 'Burning Hell',
      description: 'The realm of demons, where fire and brimstone reign supreme.',
      icon: <Flame className="w-6 h-6" />,
      color: '#8B0000',
      difficulty: 10,
      levelRange: [25, 40],
      monsterTypes: ['Demon', 'Hell Spawn', 'Balrog'],
      resources: ['Hellfire Ore', 'Demon Essence', 'Brimstone'],
      weatherEffects: ['Fire Rain', 'Lava Eruption', 'Sulfur Clouds'],
      ambientSounds: ['Roaring Flames', 'Demon Screams', 'Lava Bubbling']
    }
  ]

  const generateArea = async (biome: BiomeData) => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate generation process
    const steps = [
      'Generating terrain...',
      'Placing monsters...',
      'Creating NPCs...',
      'Distributing loot...',
      'Setting up quests...',
      'Adding waypoints...',
      'Finalizing area...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }

    const newArea: GeneratedArea = {
      id: Date.now().toString(),
      name: `${biome.name} - Instance ${generatedAreas.length + 1}`,
      biome,
      size: { width: 800 + Math.random() * 400, height: 600 + Math.random() * 300 },
      monsters: generateMonsters(biome),
      npcs: generateNPCs(biome),
      loot: generateLoot(biome),
      quests: generateQuests(biome),
      waypoints: generateWaypoints(biome),
      specialFeatures: generateSpecialFeatures(biome)
    }

    setGeneratedAreas(prev => [...prev, newArea])
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const generateMonsters = (biome: BiomeData) => {
    const monsterCount = Math.floor(Math.random() * 10) + 5
    const monsters = []

    for (let i = 0; i < monsterCount; i++) {
      const monsterType = biome.monsterTypes[Math.floor(Math.random() * biome.monsterTypes.length)]
      const level = biome.levelRange[0] + Math.floor(Math.random() * (biome.levelRange[1] - biome.levelRange[0]))
      
      monsters.push({
        id: `monster_${i}`,
        name: monsterType,
        type: monsterType.toLowerCase().replace(' ', '_'),
        level,
        health: 20 + (level * 5),
        maxHealth: 20 + (level * 5),
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600
        },
        damage: 5 + (level * 2),
        experience: level * 25,
        loot: [],
        isElite: Math.random() < 0.1,
        immunities: biome.id === 'burning_hell' ? ['fire'] : []
      })
    }

    return monsters
  }

  const generateNPCs = (biome: BiomeData) => {
    if (biome.id === 'rogue_encampment') {
      return [
        {
          id: 'kashya',
          name: 'Kashya',
          type: 'quest_giver',
          position: { x: 100, y: 100 },
          dialogue: ['Welcome to the Rogue Encampment, warrior.'],
          services: ['quests']
        },
        {
          id: 'charsi',
          name: 'Charsi',
          type: 'blacksmith',
          position: { x: 200, y: 150 },
          dialogue: ['I can repair and enhance your equipment.'],
          services: ['repair', 'upgrade']
        },
        {
          id: 'akara',
          name: 'Akara',
          type: 'healer',
          position: { x: 150, y: 200 },
          dialogue: ['I can heal your wounds and sell potions.'],
          services: ['healing', 'potions']
        }
      ]
    }

    return []
  }

  const generateLoot = (biome: BiomeData) => {
    const lootCount = Math.floor(Math.random() * 5) + 2
    const loot = []

    for (let i = 0; i < lootCount; i++) {
      loot.push({
        id: `loot_${i}`,
        name: `${biome.resources[Math.floor(Math.random() * biome.resources.length)]}`,
        type: 'resource',
        rarity: Math.random() < 0.1 ? 'rare' : 'normal',
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600
        }
      })
    }

    return loot
  }

  const generateQuests = (biome: BiomeData) => {
    const quests = []

    if (biome.id === 'blood_moor') {
      quests.push({
        id: 'den_of_evil',
        name: 'Den of Evil',
        description: 'Clear the cave of evil creatures',
        objectives: ['Kill all monsters in the Den'],
        rewards: { experience: 500, gold: 200, items: [] },
        completed: false
      })
    }

    return quests
  }

  const generateWaypoints = (biome: BiomeData) => {
    return [
      {
        id: `waypoint_${biome.id}`,
        name: `${biome.name} Waypoint`,
        position: { x: 50, y: 50 },
        unlocked: biome.id === 'rogue_encampment'
      }
    ]
  }

  const generateSpecialFeatures = (biome: BiomeData) => {
    const features = []

    switch (biome.id) {
      case 'blood_moor':
        features.push('Den of Evil Entrance', 'Corrupted Tree Grove')
        break
      case 'cold_plains':
        features.push('Frozen River', 'Ancient Burial Grounds')
        break
      case 'stony_field':
        features.push('Stone Circle', 'Underground Passage Entrance')
        break
      case 'burning_hell':
        features.push('Lava Pools', 'Demon Portal', 'Hellforge')
        break
    }

    return features
  }

  const exportToUnreal = (area: GeneratedArea) => {
    const unrealData = {
      AreaName: area.name,
      BiomeType: area.biome.id,
      WorldSize: {
        X: area.size.width * 10,
        Y: area.size.height * 10,
        Z: 1000
      },
      TerrainData: {
        MaterialPath: `/Game/Materials/Terrain/${area.biome.id}`,
        HeightmapPath: `/Game/Heightmaps/${area.biome.id}`,
        TextureLayers: area.biome.resources.map(resource => ({
          Name: resource,
          TexturePath: `/Game/Textures/Terrain/${resource.toLowerCase().replace(' ', '_')}`
        }))
      },
      MonsterSpawns: area.monsters.map(monster => ({
        MonsterType: monster.type,
        Level: monster.level,
        Position: {
          X: monster.position.x * 10,
          Y: monster.position.y * 10,
          Z: 0
        },
        IsElite: monster.isElite,
        SpawnWeight: monster.isElite ? 0.1 : 1.0,
        AIBehaviorTree: `/Game/AI/Monsters/${monster.type}/BT_${monster.type}`
      })),
      NPCPlacements: area.npcs.map(npc => ({
        NPCType: npc.type,
        Name: npc.name,
        Position: {
          X: npc.position.x * 10,
          Y: npc.position.y * 10,
          Z: 0
        },
        DialogueAsset: `/Game/Dialogue/${npc.name}`,
        Services: npc.services
      })),
      LootSpawns: area.loot.map(loot => ({
        ItemType: loot.type,
        Name: loot.name,
        Position: {
          X: loot.position.x * 10,
          Y: loot.position.y * 10,
          Z: 0
        },
        Rarity: loot.rarity,
        SpawnChance: loot.rarity === 'rare' ? 0.1 : 0.8
      })),
      Waypoints: area.waypoints.map(wp => ({
        Name: wp.name,
        Position: {
          X: wp.position.x * 10,
          Y: wp.position.y * 10,
          Z: 0
        },
        UnlockedByDefault: wp.unlocked
      })),
      EnvironmentSettings: {
        AmbientLighting: area.biome.id === 'burning_hell' ? 'Dark' : 'Normal',
        WeatherEffects: area.biome.weatherEffects,
        AmbientSounds: area.biome.ambientSounds.map(sound => ({
          SoundAsset: `/Game/Audio/Ambient/${sound.toLowerCase().replace(' ', '_')}`,
          Volume: 0.5,
          Is3D: false
        })),
        PostProcessEffects: area.biome.id === 'burning_hell' ? ['Heat_Distortion', 'Fire_Glow'] : []
      },
      SpecialFeatures: area.specialFeatures.map(feature => ({
        Name: feature,
        Type: 'Interactive',
        BlueprintPath: `/Game/Interactables/${feature.replace(' ', '_')}/BP_${feature.replace(' ', '_')}`
      })),
      QuestData: area.quests.map(quest => ({
        QuestID: quest.id,
        Name: quest.name,
        Description: quest.description,
        Objectives: quest.objectives,
        Rewards: quest.rewards,
        TriggerConditions: ['EnterArea']
      }))
    }

    const dataStr = JSON.stringify(unrealData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${area.name.replace(' ', '_')}_UnrealExport.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full bg-gradient-to-br from-red-950 via-black to-orange-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-red-400 mb-2">World Generator</h1>
          <p className="text-gray-300">Generate diverse areas and biomes for your Diablo MMO world</p>
        </div>

        <Tabs defaultValue="biomes" className="space-y-6">
          <TabsList className="bg-red-950">
            <TabsTrigger value="biomes">Biome Selection</TabsTrigger>
            <TabsTrigger value="generated">Generated Areas</TabsTrigger>
          </TabsList>

          <TabsContent value="biomes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {biomes.map(biome => (
                <Card 
                  key={biome.id}
                  className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                    selectedBiome?.id === biome.id 
                      ? 'border-red-500 bg-red-950/50' 
                      : 'border-red-800 bg-black/50 hover:border-red-600'
                  }`}
                  onClick={() => setSelectedBiome(biome)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 mt-1" style={{ color: biome.color }}>
                      {biome.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{biome.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          Lv.{biome.levelRange[0]}-{biome.levelRange[1]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{biome.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Difficulty:</span>
                          <Progress value={(biome.difficulty / 10) * 100} className="flex-1 h-2" />
                          <span className="text-xs text-white">{biome.difficulty}/10</span>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          Monsters: {biome.monsterTypes.slice(0, 2).join(', ')}
                          {biome.monsterTypes.length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedBiome && (
              <Card className="p-6 bg-black/50 border-red-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-red-400">Generate {selectedBiome.name}</h3>
                  <Button
                    onClick={() => generateArea(selectedBiome)}
                    disabled={isGenerating}
                    className="bg-red-700 hover:bg-red-600"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Area'}
                  </Button>
                </div>

                {isGenerating && (
                  <div className="mb-4">
                    <Progress value={generationProgress} className="w-full h-3" />
                    <p className="text-sm text-gray-400 mt-2">
                      Generating area... {Math.round(generationProgress)}%
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Monster Types</h4>
                    <div className="space-y-1">
                      {selectedBiome.monsterTypes.map(monster => (
                        <div key={monster} className="text-sm text-red-400">• {monster}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-2">Resources</h4>
                    <div className="space-y-1">
                      {selectedBiome.resources.map(resource => (
                        <div key={resource} className="text-sm text-yellow-400">• {resource}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-2">Weather Effects</h4>
                    <div className="space-y-1">
                      {selectedBiome.weatherEffects.map(weather => (
                        <div key={weather} className="text-sm text-blue-400">• {weather}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="generated" className="space-y-4">
            {generatedAreas.length === 0 ? (
              <Card className="p-8 bg-black/50 border-red-800 text-center">
                <Mountain className="w-16 h-16 mx-auto mb-4 text-red-400 opacity-50" />
                <h3 className="text-lg font-semibold text-white mb-2">No Areas Generated</h3>
                <p className="text-gray-400">Generate some areas from the Biome Selection tab to see them here.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {generatedAreas.map(area => (
                  <Card key={area.id} className="p-4 bg-black/50 border-red-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div style={{ color: area.biome.color }}>
                          {area.biome.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{area.name}</h3>
                          <p className="text-sm text-gray-400">{area.size.width} x {area.size.height}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => exportToUnreal(area)}
                        size="sm"
                        variant="outline"
                        className="border-orange-600 text-orange-400 hover:bg-orange-900"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center text-sm">
                      <div>
                        <div className="text-red-400 font-medium">{area.monsters.length}</div>
                        <div className="text-gray-400">Monsters</div>
                      </div>
                      <div>
                        <div className="text-blue-400 font-medium">{area.npcs.length}</div>
                        <div className="text-gray-400">NPCs</div>
                      </div>
                      <div>
                        <div className="text-yellow-400 font-medium">{area.loot.length}</div>
                        <div className="text-gray-400">Loot</div>
                      </div>
                      <div>
                        <div className="text-green-400 font-medium">{area.quests.length}</div>
                        <div className="text-gray-400">Quests</div>
                      </div>
                    </div>

                    {area.specialFeatures.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-400 mb-1">Special Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {area.specialFeatures.map(feature => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}