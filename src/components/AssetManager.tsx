import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download,
  Trash2,
  Eye,
  Edit,
  Folder,
  Image,
  Music,
  FileText,
  Zap
} from 'lucide-react'

interface Asset {
  id: string
  name: string
  type: 'sprite' | 'texture' | 'audio' | 'script' | 'animation'
  category: string
  size: string
  format: string
  preview?: string
  tags: string[]
  dateAdded: string
}

export function AssetManager() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Sample assets
  const [assets] = useState<Asset[]>([
    {
      id: '1',
      name: 'warrior_idle',
      type: 'sprite',
      category: 'characters',
      size: '64x64',
      format: 'PNG',
      tags: ['character', 'warrior', 'idle', 'animation'],
      dateAdded: '2024-01-15'
    },
    {
      id: '2',
      name: 'forest_tileset',
      type: 'texture',
      category: 'environment',
      size: '512x512',
      format: 'PNG',
      tags: ['tileset', 'forest', 'environment', 'nature'],
      dateAdded: '2024-01-14'
    },
    {
      id: '3',
      name: 'sword_swing',
      type: 'audio',
      category: 'sfx',
      size: '2.3MB',
      format: 'WAV',
      tags: ['sound', 'sword', 'combat', 'weapon'],
      dateAdded: '2024-01-13'
    },
    {
      id: '4',
      name: 'castle_walls',
      type: 'texture',
      category: 'buildings',
      size: '256x256',
      format: 'PNG',
      tags: ['building', 'castle', 'stone', 'medieval'],
      dateAdded: '2024-01-12'
    },
    {
      id: '5',
      name: 'player_controller',
      type: 'script',
      category: 'scripts',
      size: '15KB',
      format: 'JS',
      tags: ['script', 'player', 'movement', 'controller'],
      dateAdded: '2024-01-11'
    },
    {
      id: '6',
      name: 'fire_spell',
      type: 'animation',
      category: 'effects',
      size: '128x128',
      format: 'GIF',
      tags: ['animation', 'spell', 'fire', 'magic'],
      dateAdded: '2024-01-10'
    }
  ])

  const categories = [
    { id: 'all', name: 'All Assets', count: assets.length },
    { id: 'characters', name: 'Characters', count: assets.filter(a => a.category === 'characters').length },
    { id: 'environment', name: 'Environment', count: assets.filter(a => a.category === 'environment').length },
    { id: 'buildings', name: 'Buildings', count: assets.filter(a => a.category === 'buildings').length },
    { id: 'effects', name: 'Effects', count: assets.filter(a => a.category === 'effects').length },
    { id: 'sfx', name: 'Sound Effects', count: assets.filter(a => a.category === 'sfx').length },
    { id: 'scripts', name: 'Scripts', count: assets.filter(a => a.category === 'scripts').length }
  ]

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'sprite':
      case 'texture':
        return <Image className="w-4 h-4" />
      case 'audio':
        return <Music className="w-4 h-4" />
      case 'script':
        return <FileText className="w-4 h-4" />
      case 'animation':
        return <Zap className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getAssetPreview = (asset: Asset) => {
    // Generate a colored preview based on asset type
    const colors = {
      sprite: '#8B5CF6',
      texture: '#10B981',
      audio: '#F59E0B',
      script: '#3B82F6',
      animation: '#EF4444'
    }
    
    return (
      <div 
        className="w-full h-32 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: colors[asset.type] + '20' }}
      >
        <div style={{ color: colors[asset.type] }}>
          {getAssetIcon(asset.type)}
        </div>
      </div>
    )
  }

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredAssets.map(asset => (
        <Card key={asset.id} className="p-3 hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="relative">
            {getAssetPreview(asset)}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-1">
                <Button variant="secondary" size="sm" className="h-6 w-6 p-0">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="secondary" size="sm" className="h-6 w-6 p-0">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex items-center space-x-1 mb-1">
              {getAssetIcon(asset.type)}
              <h4 className="font-medium text-sm truncate">{asset.name}</h4>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
              <span>{asset.format}</span>
              <span>{asset.size}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {asset.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {asset.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{asset.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-2">
      {filteredAssets.map(asset => (
        <Card key={asset.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getAssetIcon(asset.type)}
                <span className="font-medium">{asset.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {asset.type}
              </Badge>
              <span className="text-sm text-muted-foreground">{asset.category}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{asset.format}</span>
              <span className="text-sm text-muted-foreground">{asset.size}</span>
              <span className="text-sm text-muted-foreground">{asset.dateAdded}</span>
              
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/50 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Asset Library</h3>
            <Button className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Assets
            </Button>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Categories</h4>
            <div className="space-y-1">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  className="w-full justify-between text-sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Quick Actions</h4>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clean Unused
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex border border-border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Grid/List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No assets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? `No assets match "${searchQuery}"` : 'No assets in this category'}
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Asset
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {viewMode === 'grid' ? renderGridView() : renderListView()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}