import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
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
  Copy
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
  }
  skills: string[]
  color: string
}

interface Faction {
  id: string
  name: string
  description: string
  color: string
  relations: { [key: string]: 'ally' | 'neutral' | 'enemy' }
}

interface Guild {
  id: string
  name: string
  description: string
  maxMembers: number
  requirements: string[]
  benefits: string[]
}

interface HousingType {
  id: string
  name: string
  size: string
  cost: number
  features: string[]
  biomes: string[]
}

interface Pet {
  id: string
  name: string
  type: string
  stats: {
    health: number
    damage: number
    speed: number
  }
  abilities: string[]
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export function VisualEditor() {
  const [activeSystem, setActiveSystem] = useState('classes')
  
  // Sample data
  const [characterClasses, setCharacterClasses] = useState<CharacterClass[]>([
    {
      id: '1',
      name: 'Warrior',
      description: 'A strong melee fighter with high health and defense',
      stats: { health: 100, mana: 20, strength: 80, agility: 40, intelligence: 30 },
      skills: ['Sword Mastery', 'Shield Block', 'Berserker Rage'],
      color: '#DC2626'
    },
    {
      id: '2',
      name: 'Mage',
      description: 'A powerful spellcaster with high intelligence and mana',
      stats: { health: 60, mana: 100, strength: 20, agility: 30, intelligence: 90 },
      skills: ['Fireball', 'Ice Shard', 'Teleport'],
      color: '#2563EB'
    },
    {
      id: '3',
      name: 'Rogue',
      description: 'A stealthy assassin with high agility and critical strikes',
      stats: { health: 80, mana: 40, strength: 60, agility: 90, intelligence: 50 },
      skills: ['Stealth', 'Backstab', 'Poison Blade'],
      color: '#059669'
    }
  ])

  const [factions, setFactions] = useState<Faction[]>([
    {
      id: '1',
      name: 'Order of Light',
      description: 'Defenders of justice and peace',
      color: '#FCD34D',
      relations: { '2': 'enemy', '3': 'neutral' }
    },
    {
      id: '2',
      name: 'Shadow Covenant',
      description: 'Masters of dark magic and forbidden arts',
      color: '#7C2D12',
      relations: { '1': 'enemy', '3': 'ally' }
    },
    {
      id: '3',
      name: 'Neutral Traders',
      description: 'Merchants and craftsmen focused on commerce',
      color: '#6B7280',
      relations: { '1': 'neutral', '2': 'ally' }
    }
  ])

  const [guilds, setGuilds] = useState<Guild[]>([
    {
      id: '1',
      name: 'Dragon Slayers',
      description: 'Elite guild focused on defeating powerful monsters',
      maxMembers: 50,
      requirements: ['Level 25+', 'Completed Dragon Quest'],
      benefits: ['Dragon Gear Access', 'Guild Hall', 'Weekly Raids']
    }
  ])

  const [housingTypes, setHousingTypes] = useState<HousingType[]>([
    {
      id: '1',
      name: 'Cottage',
      size: 'Small',
      cost: 1000,
      features: ['Storage Chest', 'Crafting Table'],
      biomes: ['Forest', 'Plains']
    },
    {
      id: '2',
      name: 'Manor',
      size: 'Large',
      cost: 10000,
      features: ['Multiple Rooms', 'Garden', 'Servant Quarters'],
      biomes: ['Plains', 'Hills']
    }
  ])

  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Fire Drake',
      type: 'Dragon',
      stats: { health: 150, damage: 45, speed: 30 },
      abilities: ['Fire Breath', 'Wing Buffet'],
      rarity: 'epic'
    },
    {
      id: '2',
      name: 'Shadow Wolf',
      type: 'Beast',
      stats: { health: 80, damage: 35, speed: 60 },
      abilities: ['Stealth Strike', 'Pack Hunt'],
      rarity: 'rare'
    }
  ])

  const renderClassEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Character Classes</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>
      
      <div className="grid gap-4">
        {characterClasses.map(cls => (
          <Card key={cls.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: cls.color }}
                />
                <div>
                  <h4 className="font-medium">{cls.name}</h4>
                  <p className="text-sm text-muted-foreground">{cls.description}</p>
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
            
            <div className="grid grid-cols-5 gap-2 mb-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Health</div>
                <div className="font-medium">{cls.stats.health}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Mana</div>
                <div className="font-medium">{cls.stats.mana}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Strength</div>
                <div className="font-medium">{cls.stats.strength}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Agility</div>
                <div className="font-medium">{cls.stats.agility}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Intelligence</div>
                <div className="font-medium">{cls.stats.intelligence}</div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Skills</div>
              <div className="flex flex-wrap gap-1">
                {cls.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderFactionEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Factions</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Faction
        </Button>
      </div>
      
      <div className="grid gap-4">
        {factions.map(faction => (
          <Card key={faction.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: faction.color }}
                />
                <div>
                  <h4 className="font-medium">{faction.name}</h4>
                  <p className="text-sm text-muted-foreground">{faction.description}</p>
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
            
            <div>
              <div className="text-xs text-muted-foreground mb-2">Relations</div>
              <div className="space-y-1">
                {Object.entries(faction.relations).map(([factionId, relation]) => {
                  const relatedFaction = factions.find(f => f.id === factionId)
                  if (!relatedFaction) return null
                  
                  return (
                    <div key={factionId} className="flex items-center justify-between text-sm">
                      <span>{relatedFaction.name}</span>
                      <Badge 
                        variant={relation === 'ally' ? 'default' : relation === 'enemy' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {relation}
                      </Badge>
                    </div>
                  )
                })}
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
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">{guild.name}</h4>
                <p className="text-sm text-muted-foreground">{guild.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max Members: {guild.maxMembers}
                </p>
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Requirements</div>
                <div className="space-y-1">
                  {guild.requirements.map(req => (
                    <div key={req} className="text-sm bg-muted/50 px-2 py-1 rounded">
                      {req}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Benefits</div>
                <div className="space-y-1">
                  {guild.benefits.map(benefit => (
                    <div key={benefit} className="text-sm bg-accent/20 px-2 py-1 rounded">
                      {benefit}
                    </div>
                  ))}
                </div>
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
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">{house.name}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-muted-foreground">Size: {house.size}</span>
                  <span className="text-sm text-muted-foreground">Cost: {house.cost} gold</span>
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Features</div>
                <div className="flex flex-wrap gap-1">
                  {house.features.map(feature => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Available Biomes</div>
                <div className="flex flex-wrap gap-1">
                  {house.biomes.map(biome => (
                    <Badge key={biome} variant="secondary" className="text-xs">
                      {biome}
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
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{pet.name}</h4>
                  <Badge 
                    variant={pet.rarity === 'legendary' ? 'default' : 
                            pet.rarity === 'epic' ? 'destructive' : 
                            pet.rarity === 'rare' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {pet.rarity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{pet.type}</p>
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
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Health</div>
                <div className="font-medium">{pet.stats.health}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Damage</div>
                <div className="font-medium">{pet.stats.damage}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Speed</div>
                <div className="font-medium">{pet.stats.speed}</div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Abilities</div>
              <div className="flex flex-wrap gap-1">
                {pet.abilities.map(ability => (
                  <Badge key={ability} variant="secondary" className="text-xs">
                    {ability}
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
            Pets
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