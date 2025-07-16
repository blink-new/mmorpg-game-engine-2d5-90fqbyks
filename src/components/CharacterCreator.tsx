import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Sword, 
  Zap, 
  Skull, 
  Shield, 
  Target, 
  Leaf, 
  Dagger 
} from 'lucide-react'

interface CharacterClass {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  primaryStat: string
  stats: {
    strength: number
    dexterity: number
    vitality: number
    energy: number
  }
  startingSkills: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  playstyle: string
}

interface CharacterCreatorProps {
  onCharacterCreated: (character: any) => void
  onCancel: () => void
}

export function CharacterCreator({ onCharacterCreated, onCancel }: CharacterCreatorProps) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null)
  const [characterName, setCharacterName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const characterClasses: CharacterClass[] = [
    {
      id: 'barbarian',
      name: 'Barbarian',
      description: 'A fierce warrior from the northern highlands, masters of melee combat and primal fury.',
      icon: <Sword className="w-8 h-8" />,
      primaryStat: 'Strength',
      stats: { strength: 30, dexterity: 20, vitality: 25, energy: 10 },
      startingSkills: ['Bash', 'Howl', 'Taunt'],
      difficulty: 'Easy',
      playstyle: 'Melee DPS/Tank'
    },
    {
      id: 'sorceress',
      name: 'Sorceress',
      description: 'A master of the elemental magics, wielding fire, ice, and lightning with devastating effect.',
      icon: <Zap className="w-8 h-8" />,
      primaryStat: 'Energy',
      stats: { strength: 10, dexterity: 25, vitality: 20, energy: 35 },
      startingSkills: ['Charged Bolt', 'Warmth', 'Fire Bolt'],
      difficulty: 'Hard',
      playstyle: 'Ranged Magic DPS'
    },
    {
      id: 'necromancer',
      name: 'Necromancer',
      description: 'A practitioner of the dark arts, commanding undead minions and cursing enemies.',
      icon: <Skull className="w-8 h-8" />,
      primaryStat: 'Energy',
      stats: { strength: 15, dexterity: 25, vitality: 15, energy: 25 },
      startingSkills: ['Raise Skeleton', 'Amplify Damage', 'Teeth'],
      difficulty: 'Medium',
      playstyle: 'Summoner/Support'
    },
    {
      id: 'paladin',
      name: 'Paladin',
      description: 'A holy warrior blessed with divine powers, excelling in both combat and support magic.',
      icon: <Shield className="w-8 h-8" />,
      primaryStat: 'Strength',
      stats: { strength: 25, dexterity: 20, vitality: 25, energy: 15 },
      startingSkills: ['Sacrifice', 'Prayer', 'Might'],
      difficulty: 'Easy',
      playstyle: 'Tank/Support'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      description: 'A skilled warrior-woman from the island realm, master of bow and spear combat.',
      icon: <Target className="w-8 h-8" />,
      primaryStat: 'Dexterity',
      stats: { strength: 20, dexterity: 25, vitality: 20, energy: 15 },
      startingSkills: ['Jab', 'Magic Arrow', 'Inner Sight'],
      difficulty: 'Medium',
      playstyle: 'Ranged Physical DPS'
    },
    {
      id: 'assassin',
      name: 'Assassin',
      description: 'A shadow warrior trained in martial arts and trap-making, striking from the darkness.',
      icon: <Dagger className="w-8 h-8" />,
      primaryStat: 'Dexterity',
      stats: { strength: 20, dexterity: 30, vitality: 20, energy: 15 },
      startingSkills: ['Tiger Strike', 'Fire Blast', 'Claw Mastery'],
      difficulty: 'Hard',
      playstyle: 'Melee DPS/Traps'
    },
    {
      id: 'druid',
      name: 'Druid',
      description: 'A guardian of nature who can shapeshift into beasts and command elemental forces.',
      icon: <Leaf className="w-8 h-8" />,
      primaryStat: 'Vitality',
      stats: { strength: 15, dexterity: 20, vitality: 30, energy: 20 },
      startingSkills: ['Firestorm', 'Werewolf', 'Raven'],
      difficulty: 'Medium',
      playstyle: 'Shapeshifter/Summoner'
    }
  ]

  const handleCreateCharacter = () => {
    if (!selectedClass || !characterName.trim()) return

    setIsCreating(true)
    
    // Simulate character creation delay
    setTimeout(() => {
      const newCharacter = {
        id: Date.now().toString(),
        name: characterName.trim(),
        class: selectedClass.name,
        level: 1,
        experience: 0,
        experienceToNext: 1000,
        stats: {
          health: 50 + (selectedClass.stats.vitality * 2),
          maxHealth: 50 + (selectedClass.stats.vitality * 2),
          mana: 20 + (selectedClass.stats.energy * 2),
          maxMana: 20 + (selectedClass.stats.energy * 2),
          ...selectedClass.stats
        },
        position: { x: 400, y: 300 },
        inventory: [],
        equipment: {},
        skills: selectedClass.startingSkills.map((skillName, index) => ({
          id: (index + 1).toString(),
          name: skillName,
          level: 1,
          maxLevel: 20,
          description: `${skillName} - Starting skill for ${selectedClass.name}`,
          manaCost: 2 + index,
          cooldown: 1000,
          damage: 10 + (index * 5),
          type: 'active' as const
        })),
        gold: 100,
        classData: selectedClass
      }
      
      onCharacterCreated(newCharacter)
      setIsCreating(false)
    }, 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 border-green-400'
      case 'Medium': return 'text-yellow-400 border-yellow-400'
      case 'Hard': return 'text-red-400 border-red-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-orange-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-2">Create Your Hero</h1>
          <p className="text-gray-300">Choose your class and begin your journey through the world of Sanctuary</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Class Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">Choose Your Class</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characterClasses.map(charClass => (
                <Card 
                  key={charClass.id}
                  className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                    selectedClass?.id === charClass.id 
                      ? 'border-red-500 bg-red-950/50' 
                      : 'border-red-800 bg-black/50 hover:border-red-600'
                  }`}
                  onClick={() => setSelectedClass(charClass)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 mt-1">
                      {charClass.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{charClass.name}</h3>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(charClass.difficulty)}`}>
                          {charClass.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{charClass.description}</p>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400">
                          Primary Stat: <span className="text-yellow-400">{charClass.primaryStat}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Playstyle: <span className="text-blue-400">{charClass.playstyle}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>STR: {charClass.stats.strength}</div>
                          <div>DEX: {charClass.stats.dexterity}</div>
                          <div>VIT: {charClass.stats.vitality}</div>
                          <div>ENE: {charClass.stats.energy}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Character Details & Creation */}
          <div className="space-y-6">
            {selectedClass && (
              <Card className="p-6 bg-black/50 border-red-800">
                <h3 className="text-xl font-semibold text-red-400 mb-4">Character Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="characterName" className="text-white">Character Name</Label>
                    <Input
                      id="characterName"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      placeholder="Enter character name"
                      className="mt-1 bg-red-950/30 border-red-700 text-white"
                      maxLength={16}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-2">Starting Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Strength</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={(selectedClass.stats.strength / 40) * 100} className="w-16 h-2" />
                          <span className="text-sm text-white w-6">{selectedClass.stats.strength}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Dexterity</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={(selectedClass.stats.dexterity / 40) * 100} className="w-16 h-2" />
                          <span className="text-sm text-white w-6">{selectedClass.stats.dexterity}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Vitality</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={(selectedClass.stats.vitality / 40) * 100} className="w-16 h-2" />
                          <span className="text-sm text-white w-6">{selectedClass.stats.vitality}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Energy</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={(selectedClass.stats.energy / 40) * 100} className="w-16 h-2" />
                          <span className="text-sm text-white w-6">{selectedClass.stats.energy}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-2">Starting Skills</h4>
                    <div className="space-y-1">
                      {selectedClass.startingSkills.map(skill => (
                        <div key={skill} className="text-sm text-yellow-400">
                          • {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={handleCreateCharacter}
                      disabled={!characterName.trim() || isCreating}
                      className="w-full bg-red-700 hover:bg-red-600 text-white"
                    >
                      {isCreating ? 'Creating Character...' : 'Create Character'}
                    </Button>
                    
                    <Button
                      onClick={onCancel}
                      variant="outline"
                      className="w-full border-red-700 text-red-400 hover:bg-red-950"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {!selectedClass && (
              <Card className="p-6 bg-black/50 border-red-800">
                <div className="text-center text-gray-400">
                  <Sword className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a character class to view details and create your hero</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}