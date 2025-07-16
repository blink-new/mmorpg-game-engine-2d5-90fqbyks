import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { Slider } from './ui/slider'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { 
  Users, 
  Shield, 
  Home, 
  Heart, 
  Sword, 
  Crown,
  Plus,
  Edit,
  Trash2,
  Copy,
  Zap,
  Target,
  Star,
  Gem,
  Coins,
  BookOpen,
  Settings,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react'

interface CharacterClass {
  id: string
  name: string
  description: string
  stats: {
    health: number
    mana: number
    strength: number
    agility: number
    intelligence: number
    vitality: number
    luck: number
  }
  skills: Skill[]
  color: string
  icon: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  playstyle: string
  startingEquipment: string[]
  classBonus: string
}

interface Skill {
  id: string
  name: string
  description: string
  type: 'active' | 'passive' | 'ultimate'
  manaCost: number
  cooldown: number
  damage: number
  level: number
  maxLevel: number
  requirements: string[]
}

interface Faction {
  id: string
  name: string
  description: string
  color: string
  leader: string
  territory: string[]
  relations: { [key: string]: 'ally' | 'neutral' | 'enemy' | 'war' }
  benefits: string[]
  requirements: string[]
  reputation: {
    hostile: number
    unfriendly: number
    neutral: number
    friendly: number
    honored: number
    revered: number
    exalted: number
  }
}

interface Guild {
  id: string
  name: string
  description: string
  type: 'PvE' | 'PvP' | 'Crafting' | 'Social' | 'Mixed'
  maxMembers: number
  requirements: string[]
  benefits: string[]
  ranks: GuildRank[]
  activities: string[]
  guildHall: string
}

interface GuildRank {
  id: string
  name: string
  permissions: string[]
  color: string
  order: number
}

interface HousingType {
  id: string
  name: string
  size: 'Small' | 'Medium' | 'Large' | 'Mansion'
  cost: number
  upkeep: number
  features: string[]
  biomes: string[]
  maxRooms: number
  storageSlots: number
  craftingStations: string[]
  defenseRating: number
}

interface Pet {
  id: string
  name: string
  type: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  stats: {
    health: number
    damage: number
    speed: number
    defense: number
    loyalty: number
  }
  abilities: PetAbility[]
  evolution: {
    canEvolve: boolean
    requirements: string[]
    evolvesInto: string[]
  }
  habitat: string[]
  tamingDifficulty: number
  feedingRequirements: string[]
}

interface PetAbility {
  id: string
  name: string
  description: string
  type: 'combat' | 'utility' | 'passive'
  cooldown: number
  effect: string
}

export function VisualEditor() {
  const [activeSystem, setActiveSystem] = useState('classes')
  const [previewMode, setPreviewMode] = useState(false)
  
  // Sample data with enhanced features
  const [characterClasses, setCharacterClasses] = useState<CharacterClass[]>([
    {
      id: '1',
      name: 'Paladin',
      description: 'A holy warrior blessed with divine powers, excelling in both combat and support magic.',
      stats: { health: 120, mana: 60, strength: 85, agility: 45, intelligence: 60, vitality: 90, luck: 50 },
      skills: [
        {
          id: 's1', name: 'Divine Strike', description: 'A powerful melee attack infused with holy energy',
          type: 'active', manaCost: 15, cooldown: 3000, damage: 150, level: 1, maxLevel: 10,
          requirements: ['Level 1']
        },
        {
          id: 's2', name: 'Healing Light', description: 'Restores health to self or ally',
          type: 'active', manaCost: 20, cooldown: 5000, damage: 0, level: 1, maxLevel: 15,
          requirements: ['Level 3']
        },
        {
          id: 's3', name: 'Aura of Protection', description: 'Increases defense of nearby allies',
          type: 'passive', manaCost: 0, cooldown: 0, damage: 0, level: 1, maxLevel: 8,
          requirements: ['Level 10']
        }
      ],
      color: '#FCD34D',
      icon: '🛡️',
      difficulty: 'Beginner',
      playstyle: 'Tank/Support Hybrid',
      startingEquipment: ['Iron Sword', 'Wooden Shield', 'Cloth Armor', 'Health Potion x3'],
      classBonus: '+25% healing effectiveness, +15% magic resistance'
    },
    {
      id: '2',
      name: 'Shadow Assassin',
      description: 'A master of stealth and precision strikes, capable of eliminating enemies before they know what hit them.',
      stats: { health: 80, mana: 70, strength: 70, agility: 95, intelligence: 65, vitality: 60, luck: 85 },
      skills: [
        {
          id: 's4', name: 'Stealth', description: 'Become invisible for a short duration',
          type: 'active', manaCost: 25, cooldown: 8000, damage: 0, level: 1, maxLevel: 12,
          requirements: ['Level 1']
        },
        {
          id: 's5', name: 'Backstab', description: 'Deal massive damage when attacking from behind',
          type: 'active', manaCost: 20, cooldown: 4000, damage: 200, level: 1, maxLevel: 15,
          requirements: ['Level 5']
        },
        {
          id: 's6', name: 'Shadow Clone', description: 'Create a shadow duplicate that fights alongside you',
          type: 'ultimate', manaCost: 80, cooldown: 60000, damage: 0, level: 1, maxLevel: 5,
          requirements: ['Level 25', 'Master Stealth']
        }
      ],
      color: '#7C2D12',
      icon: '🗡️',
      difficulty: 'Expert',
      playstyle: 'High-Risk High-Reward DPS',
      startingEquipment: ['Twin Daggers', 'Leather Armor', 'Smoke Bomb x5', 'Lockpicks'],
      classBonus: '+30% critical hit chance, +20% movement speed in darkness'
    },
    {
      id: '3',
      name: 'Arcane Mage',
      description: 'A master of elemental magic, wielding devastating spells that can reshape the battlefield.',
      stats: { health: 60, mana: 140, strength: 30, agility: 50, intelligence: 120, vitality: 45, luck: 60 },
      skills: [
        {
          id: 's7', name: 'Fireball', description: 'Launch a blazing projectile that explodes on impact',
          type: 'active', manaCost: 30, cooldown: 2000, damage: 180, level: 1, maxLevel: 20,
          requirements: ['Level 1']
        },
        {
          id: 's8', name: 'Ice Shield', description: 'Create a protective barrier that slows attackers',
          type: 'active', manaCost: 40, cooldown: 10000, damage: 0, level: 1, maxLevel: 10,
          requirements: ['Level 8']
        },
        {
          id: 's9', name: 'Meteor', description: 'Call down a devastating meteor from the sky',
          type: 'ultimate', manaCost: 120, cooldown: 45000, damage: 500, level: 1, maxLevel: 8,
          requirements: ['Level 30', 'Master Fire Magic']
        }
      ],
      color: '#8B5CF6',
      icon: '🔮',
      difficulty: 'Advanced',
      playstyle: 'Ranged Magical DPS',
      startingEquipment: ['Wooden Staff', 'Mage Robes', 'Mana Potion x5', 'Spellbook'],
      classBonus: '+40% spell damage, +25% mana regeneration'
    }
  ])

  const [factions, setFactions] = useState<Faction[]>([
    {
      id: '1',
      name: 'Order of the Silver Dawn',
      description: 'Defenders of justice and peace, sworn to protect the innocent from the forces of darkness.',
      color: '#FCD34D',
      leader: 'High Paladin Aurelius',
      territory: ['Capital City', 'Silver Fortress', 'Temple District'],
      relations: { '2': 'enemy', '3': 'ally', '4': 'neutral' },
      benefits: [
        'Access to Holy Magic Training',
        '15% discount at temples',
        'Priority healing at faction healers',
        'Exclusive silver-blessed equipment'
      ],
      requirements: [
        'Good alignment',
        'Complete initiation quest',
        'Level 10 minimum',
        'No criminal record'
      ],
      reputation: {
        hostile: -6000,
        unfriendly: -3000,
        neutral: 0,
        friendly: 3000,
        honored: 9000,
        revered: 21000,
        exalted: 42000
      }
    },
    {
      id: '2',
      name: 'Shadow Covenant',
      description: 'Masters of dark magic and forbidden arts, seeking power through any means necessary.',
      color: '#7C2D12',
      leader: 'Archlich Malachar',
      territory: ['Dark Citadel', 'Shadowlands', 'Necropolis'],
      relations: { '1': 'enemy', '3': 'neutral', '4': 'ally' },
      benefits: [
        'Access to Dark Magic spells',
        'Undead minion summoning',
        'Immunity to fear effects',
        'Shadow realm teleportation'
      ],
      requirements: [
        'Evil or neutral alignment',
        'Sacrifice ritual completion',
        'Level 15 minimum',
        'Prove loyalty through dark deeds'
      ],
      reputation: {
        hostile: -6000,
        unfriendly: -3000,
        neutral: 0,
        friendly: 3000,
        honored: 9000,
        revered: 21000,
        exalted: 42000
      }
    }
  ])

  const [guilds, setGuilds] = useState<Guild[]>([
    {
      id: '1',
      name: 'Dragon Slayers United',
      description: 'Elite guild focused on defeating the most powerful monsters and dragons in the realm.',
      type: 'PvE',
      maxMembers: 100,
      requirements: [
        'Level 25 minimum',
        'Completed at least 5 dungeon runs',
        'Proven combat experience',
        'Team player attitude'
      ],
      benefits: [
        'Access to exclusive dragon hunting grounds',
        'Guild-crafted dragon-scale armor',
        'Weekly organized raids',
        'Shared loot distribution system',
        'Guild hall with training facilities'
      ],
      ranks: [
        { id: 'r1', name: 'Initiate', permissions: ['Chat', 'View roster'], color: '#9CA3AF', order: 1 },
        { id: 'r2', name: 'Member', permissions: ['Chat', 'View roster', 'Join raids'], color: '#10B981', order: 2 },
        { id: 'r3', name: 'Veteran', permissions: ['Chat', 'View roster', 'Join raids', 'Invite members'], color: '#3B82F6', order: 3 },
        { id: 'r4', name: 'Officer', permissions: ['All member perms', 'Kick members', 'Manage events'], color: '#8B5CF6', order: 4 },
        { id: 'r5', name: 'Guild Master', permissions: ['Full control'], color: '#F59E0B', order: 5 }
      ],
      activities: ['Dragon Raids', 'Dungeon Runs', 'PvE Events', 'Training Sessions'],
      guildHall: 'Mountain Fortress'
    },
    {
      id: '2',
      name: 'Merchants of Fortune',
      description: 'A trading guild focused on commerce, crafting, and economic domination.',
      type: 'Crafting',
      maxMembers: 150,
      requirements: [
        'Level 10 minimum',
        'Basic crafting skill',
        'Initial investment of 1000 gold',
        'Business-minded approach'
      ],
      benefits: [
        'Shared crafting materials warehouse',
        'Bulk purchasing discounts',
        'Trade route protection',
        'Market information network',
        'Exclusive crafting recipes'
      ],
      ranks: [
        { id: 'r6', name: 'Apprentice', permissions: ['Basic trading'], color: '#9CA3AF', order: 1 },
        { id: 'r7', name: 'Trader', permissions: ['Advanced trading', 'Warehouse access'], color: '#10B981', order: 2 },
        { id: 'r8', name: 'Merchant', permissions: ['All trader perms', 'Route planning'], color: '#3B82F6', order: 3 },
        { id: 'r9', name: 'Trade Baron', permissions: ['All merchant perms', 'Guild investments'], color: '#F59E0B', order: 4 }
      ],
      activities: ['Trade Expeditions', 'Crafting Competitions', 'Market Analysis', 'Resource Gathering'],
      guildHall: 'Grand Marketplace'
    }
  ])

  const [housingTypes, setHousingTypes] = useState<HousingType[]>([
    {
      id: '1',
      name: 'Cozy Cottage',
      size: 'Small',
      cost: 5000,
      upkeep: 50,
      features: ['Garden Plot', 'Basic Storage', 'Fireplace', 'Single Bedroom'],
      biomes: ['Forest', 'Plains', 'Hills'],
      maxRooms: 3,
      storageSlots: 50,
      craftingStations: ['Basic Workbench'],
      defenseRating: 2
    },
    {
      id: '2',
      name: 'Noble Manor',
      size: 'Large',
      cost: 50000,
      upkeep: 500,
      features: [
        'Multiple Bedrooms', 'Grand Hall', 'Library', 'Wine Cellar', 
        'Servant Quarters', 'Stables', 'Private Garden', 'Balcony'
      ],
      biomes: ['Plains', 'Hills', 'Coastal'],
      maxRooms: 12,
      storageSlots: 200,
      craftingStations: ['Advanced Forge', 'Alchemy Lab', 'Enchanting Table'],
      defenseRating: 7
    },
    {
      id: '3',
      name: 'Wizard Tower',
      size: 'Medium',
      cost: 25000,
      upkeep: 300,
      features: [
        'Spell Laboratory', 'Arcane Library', 'Scrying Room', 
        'Magical Garden', 'Teleportation Circle', 'Observatory'
      ],
      biomes: ['Mountains', 'Forest', 'Magical Zones'],
      maxRooms: 8,
      storageSlots: 150,
      craftingStations: ['Enchanting Altar', 'Potion Brewing Station', 'Spell Research Desk'],
      defenseRating: 9
    }
  ])

  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Ember Drake',
      type: 'Dragon',
      rarity: 'epic',
      stats: { health: 200, damage: 60, speed: 45, defense: 40, loyalty: 80 },
      abilities: [
        {
          id: 'pa1', name: 'Fire Breath', description: 'Breathes fire in a cone, dealing damage over time',
          type: 'combat', cooldown: 8000, effect: '120 fire damage + 20 DoT for 5 seconds'
        },
        {
          id: 'pa2', name: 'Wing Buffet', description: 'Knocks back enemies with powerful wing beats',
          type: 'combat', cooldown: 12000, effect: 'Knockback + 80 damage'
        },
        {
          id: 'pa3', name: 'Flame Aura', description: 'Passive fire damage to nearby enemies',
          type: 'passive', cooldown: 0, effect: '10 fire damage per second to enemies within 5 meters'
        }
      ],
      evolution: {
        canEvolve: true,
        requirements: ['Level 50', 'Dragon Heart x3', 'Ancient Fire Crystal'],
        evolvesInto: ['Ancient Fire Dragon', 'Volcanic Wyrm']
      },
      habitat: ['Volcanic Regions', 'Mountain Caves', 'Fire Elemental Planes'],
      tamingDifficulty: 8,
      feedingRequirements: ['Raw Meat', 'Fire Crystals', 'Sulfur']
    },
    {
      id: '2',
      name: 'Shadow Wolf',
      type: 'Beast',
      rarity: 'rare',
      stats: { health: 120, damage: 45, speed: 80, defense: 25, loyalty: 90 },
      abilities: [
        {
          id: 'pa4', name: 'Stealth Strike', description: 'Becomes invisible and deals critical damage',
          type: 'combat', cooldown: 15000, effect: 'Invisibility for 3 seconds + 200% critical hit'
        },
        {
          id: 'pa5', name: 'Pack Hunt', description: 'Calls shadow wolves to assist in battle',
          type: 'combat', cooldown: 30000, effect: 'Summons 2 shadow wolves for 20 seconds'
        },
        {
          id: 'pa6', name: 'Night Vision', description: 'Enhanced vision in dark areas',
          type: 'utility', cooldown: 0, effect: 'Reveals hidden enemies and traps'
        }
      ],
      evolution: {
        canEvolve: true,
        requirements: ['Level 30', 'Moon Stone', 'Shadow Essence x5'],
        evolvesInto: ['Dire Shadow Wolf', 'Phantom Beast']
      },
      habitat: ['Dark Forests', 'Shadow Realm', 'Nighttime Areas'],
      tamingDifficulty: 6,
      feedingRequirements: ['Fresh Meat', 'Shadow Berries', 'Moonwater']
    },
    {
      id: '3',
      name: 'Crystal Fairy',
      type: 'Magical',
      rarity: 'legendary',
      stats: { health: 60, damage: 30, speed: 95, defense: 15, loyalty: 95 },
      abilities: [
        {
          id: 'pa7', name: 'Healing Dust', description: 'Sprinkles magical dust that heals allies',
          type: 'utility', cooldown: 10000, effect: 'Heals 80 HP to all party members'
        },
        {
          id: 'pa8', name: 'Mana Restoration', description: 'Restores mana to the owner',
          type: 'utility', cooldown: 20000, effect: 'Restores 100 mana points'
        },
        {
          id: 'pa9', name: 'Lucky Charm', description: 'Increases luck and rare item drop rates',
          type: 'passive', cooldown: 0, effect: '+15% luck, +10% rare drop rate'
        }
      ],
      evolution: {
        canEvolve: false,
        requirements: [],
        evolvesInto: []
      },
      habitat: ['Crystal Caves', 'Magical Gardens', 'Fairy Rings'],
      tamingDifficulty: 9,
      feedingRequirements: ['Nectar', 'Crystal Shards', 'Fairy Dust']
    }
  ])

  const renderClassEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Character Classes</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {characterClasses.map(cls => (
          <Card key={cls.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{cls.icon}</div>
                <div>
                  <h4 className="font-medium text-lg">{cls.name}</h4>
                  <p className="text-sm text-muted-foreground">{cls.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge variant="outline" className={`text-xs ${
                      cls.difficulty === 'Beginner' ? 'border-green-500 text-green-500' :
                      cls.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-500' :
                      cls.difficulty === 'Advanced' ? 'border-orange-500 text-orange-500' :
                      'border-red-500 text-red-500'
                    }`}>
                      {cls.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{cls.playstyle}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Stats Display */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {Object.entries(cls.stats).map(([stat, value]) => (
                <div key={stat} className="text-center">
                  <div className="text-xs text-muted-foreground capitalize">{stat}</div>
                  <div className="font-medium">{value}</div>
                  <Progress value={(value / 150) * 100} className="h-1 mt-1" />
                </div>
              ))}
            </div>
            
            {/* Skills */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Skills</div>
              <div className="space-y-2">
                {cls.skills.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        skill.type === 'ultimate' ? 'destructive' :
                        skill.type === 'active' ? 'default' : 'secondary'
                      } className="text-xs">
                        {skill.type}
                      </Badge>
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      {skill.manaCost > 0 && <span>🔵 {skill.manaCost}</span>}
                      {skill.cooldown > 0 && <span>⏱️ {skill.cooldown/1000}s</span>}
                      {skill.damage > 0 && <span>⚔️ {skill.damage}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Starting Equipment */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Starting Equipment</div>
              <div className="flex flex-wrap gap-1">
                {cls.startingEquipment.map(item => (
                  <Badge key={item} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Class Bonus */}
            <div className="p-2 bg-accent/20 rounded text-sm">
              <span className="font-medium">Class Bonus: </span>
              {cls.classBonus}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderFactionEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Faction System</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Faction
        </Button>
      </div>
      
      <div className="grid gap-4">
        {factions.map(faction => (
          <Card key={faction.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: faction.color }}
                />
                <div>
                  <h4 className="font-medium text-lg">{faction.name}</h4>
                  <p className="text-sm text-muted-foreground">{faction.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Leader: <span className="font-medium">{faction.leader}</span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Territory */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Territory</div>
              <div className="flex flex-wrap gap-1">
                {faction.territory.map(territory => (
                  <Badge key={territory} variant="secondary" className="text-xs">
                    {territory}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Relations */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Faction Relations</div>
              <div className="space-y-1">
                {Object.entries(faction.relations).map(([factionId, relation]) => {
                  const relatedFaction = factions.find(f => f.id === factionId)
                  if (!relatedFaction) return null
                  
                  return (
                    <div key={factionId} className="flex items-center justify-between text-sm">
                      <span>{relatedFaction.name}</span>
                      <Badge 
                        variant={
                          relation === 'ally' ? 'default' : 
                          relation === 'enemy' ? 'destructive' : 
                          relation === 'war' ? 'destructive' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {relation}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Requirements & Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium mb-2">Requirements</div>
                <div className="space-y-1">
                  {faction.requirements.map(req => (
                    <div key={req} className="text-xs bg-muted/50 px-2 py-1 rounded">
                      {req}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Benefits</div>
                <div className="space-y-1">
                  {faction.benefits.map(benefit => (
                    <div key={benefit} className="text-xs bg-accent/20 px-2 py-1 rounded">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Reputation System */}
            <div>
              <div className="text-sm font-medium mb-2">Reputation System</div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {Object.entries(faction.reputation).map(([level, points]) => (
                  <div key={level} className="text-center">
                    <div className="capitalize font-medium">{level}</div>
                    <div className="text-muted-foreground">{points}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderGuildEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Guild System</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Guild Template
        </Button>
      </div>
      
      <div className="grid gap-4">
        {guilds.map(guild => (
          <Card key={guild.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-lg">{guild.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {guild.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{guild.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>Max Members: {guild.maxMembers}</span>
                  <span>Guild Hall: {guild.guildHall}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Guild Ranks */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Guild Ranks</div>
              <div className="space-y-1">
                {guild.ranks.sort((a, b) => b.order - a.order).map(rank => (
                  <div key={rank.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: rank.color }}
                      />
                      <span className="text-sm font-medium">{rank.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rank.permissions.length} permissions
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Requirements & Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium mb-2">Requirements</div>
                <div className="space-y-1">
                  {guild.requirements.map(req => (
                    <div key={req} className="text-xs bg-muted/50 px-2 py-1 rounded">
                      {req}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Benefits</div>
                <div className="space-y-1">
                  {guild.benefits.map(benefit => (
                    <div key={benefit} className="text-xs bg-accent/20 px-2 py-1 rounded">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Activities */}
            <div>
              <div className="text-sm font-medium mb-2">Guild Activities</div>
              <div className="flex flex-wrap gap-1">
                {guild.activities.map(activity => (
                  <Badge key={activity} variant="secondary" className="text-xs">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderHousingEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Housing System</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Housing Type
        </Button>
      </div>
      
      <div className="grid gap-4">
        {housingTypes.map(house => (
          <Card key={house.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium text-lg">{house.name}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm">
                  <Badge variant="outline">{house.size}</Badge>
                  <span className="text-muted-foreground">
                    <Coins className="w-4 h-4 inline mr-1" />
                    {house.cost.toLocaleString()} gold
                  </span>
                  <span className="text-muted-foreground">
                    Upkeep: {house.upkeep}/month
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* House Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Max Rooms</div>
                <div className="font-medium">{house.maxRooms}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Storage</div>
                <div className="font-medium">{house.storageSlots}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Defense</div>
                <div className="font-medium">{house.defenseRating}/10</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Crafting</div>
                <div className="font-medium">{house.craftingStations.length}</div>
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Features</div>
              <div className="flex flex-wrap gap-1">
                {house.features.map(feature => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Available Biomes & Crafting Stations */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">Available Biomes</div>
                <div className="flex flex-wrap gap-1">
                  {house.biomes.map(biome => (
                    <Badge key={biome} variant="secondary" className="text-xs">
                      {biome}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Crafting Stations</div>
                <div className="flex flex-wrap gap-1">
                  {house.craftingStations.map(station => (
                    <Badge key={station} variant="default" className="text-xs">
                      {station}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderPetEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pet System</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Pet
        </Button>
      </div>
      
      <div className="grid gap-4">
        {pets.map(pet => (
          <Card key={pet.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-lg">{pet.name}</h4>
                  <Badge 
                    variant={
                      pet.rarity === 'mythic' ? 'destructive' :
                      pet.rarity === 'legendary' ? 'default' : 
                      pet.rarity === 'epic' ? 'secondary' : 'outline'
                    }
                    className="text-xs"
                  >
                    {pet.rarity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{pet.type}</p>
                <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                  <span>Taming Difficulty: {pet.tamingDifficulty}/10</span>
                  <span>•</span>
                  <span>Loyalty: {pet.stats.loyalty}%</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Pet Stats */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {Object.entries(pet.stats).map(([stat, value]) => (
                <div key={stat} className="text-center">
                  <div className="text-xs text-muted-foreground capitalize">{stat}</div>
                  <div className="font-medium">{value}</div>
                  <Progress value={(value / 100) * 100} className="h-1 mt-1" />
                </div>
              ))}
            </div>
            
            {/* Pet Abilities */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Abilities</div>
              <div className="space-y-2">
                {pet.abilities.map(ability => (
                  <div key={ability.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        ability.type === 'combat' ? 'destructive' :
                        ability.type === 'utility' ? 'default' : 'secondary'
                      } className="text-xs">
                        {ability.type}
                      </Badge>
                      <div>
                        <div className="text-sm font-medium">{ability.name}</div>
                        <div className="text-xs text-muted-foreground">{ability.description}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ability.cooldown > 0 && `${ability.cooldown/1000}s CD`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Evolution & Habitat */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium mb-2">Evolution</div>
                {pet.evolution.canEvolve ? (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground mb-1">Requirements:</div>
                    {pet.evolution.requirements.map(req => (
                      <div key={req} className="text-xs bg-muted/50 px-2 py-1 rounded">
                        {req}
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground mt-2 mb-1">Evolves into:</div>
                    {pet.evolution.evolvesInto.map(evolution => (
                      <Badge key={evolution} variant="outline" className="text-xs mr-1">
                        {evolution}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Cannot evolve</div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Habitat</div>
                <div className="flex flex-wrap gap-1">
                  {pet.habitat.map(habitat => (
                    <Badge key={habitat} variant="secondary" className="text-xs">
                      {habitat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Feeding Requirements */}
            <div>
              <div className="text-sm font-medium mb-2">Feeding Requirements</div>
              <div className="flex flex-wrap gap-1">
                {pet.feedingRequirements.map(food => (
                  <Badge key={food} variant="outline" className="text-xs">
                    {food}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="h-full flex">
      {/* System Navigation */}
      <div className="w-64 border-r border-border bg-card/50 p-4">
        <h3 className="text-lg font-semibold mb-4">Game Systems</h3>
        
        <div className="space-y-2">
          <Button
            variant={activeSystem === 'classes' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSystem('classes')}
          >
            <Sword className="w-4 h-4 mr-2" />
            Character Classes
          </Button>
          
          <Button
            variant={activeSystem === 'factions' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSystem('factions')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Factions
          </Button>
          
          <Button
            variant={activeSystem === 'guilds' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSystem('guilds')}
          >
            <Users className="w-4 h-4 mr-2" />
            Guilds
          </Button>
          
          <Button
            variant={activeSystem === 'housing' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSystem('housing')}
          >
            <Home className="w-4 h-4 mr-2" />
            Housing
          </Button>
          
          <Button
            variant={activeSystem === 'pets' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSystem('pets')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Pets & Companions
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Tools</h4>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Global Settings
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Palette className="w-4 h-4 mr-2" />
            Theme Editor
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <BookOpen className="w-4 h-4 mr-2" />
            Documentation
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSystem === 'classes' && renderClassEditor()}
        {activeSystem === 'factions' && renderFactionEditor()}
        {activeSystem === 'guilds' && renderGuildEditor()}
        {activeSystem === 'housing' && renderHousingEditor()}
        {activeSystem === 'pets' && renderPetEditor()}
      </div>
    </div>
  )
}