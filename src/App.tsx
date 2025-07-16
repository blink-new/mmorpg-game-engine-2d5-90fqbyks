import React, { useState } from 'react'
import { GameEngine } from './components/GameEngine'
import { VisualEditor } from './components/VisualEditor'
import { AssetManager } from './components/AssetManager'
import { WorldBuilder } from './components/WorldBuilder'
import { DiabloMMO } from './components/DiabloMMO'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Button } from './components/ui/button'
import { Play, Pause, Settings, Save, Download, Gamepad2 } from 'lucide-react'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('diablo')

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving project...')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting game...')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              2.5D MMORPG Engine
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant={isPlaying ? "destructive" : "default"}
                size="sm"
                onClick={handlePlayPause}
                className="flex items-center space-x-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Stop' : 'Play'}</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5 bg-card/50 border-b">
            <TabsTrigger value="diablo" className="data-[state=active]:bg-primary/20">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Diablo MMO
            </TabsTrigger>
            <TabsTrigger value="engine" className="data-[state=active]:bg-primary/20">
              Game Engine
            </TabsTrigger>
            <TabsTrigger value="editor" className="data-[state=active]:bg-primary/20">
              Visual Editor
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-primary/20">
              Asset Manager
            </TabsTrigger>
            <TabsTrigger value="world" className="data-[state=active]:bg-primary/20">
              World Builder
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="diablo" className="h-full m-0">
              <DiabloMMO />
            </TabsContent>
            
            <TabsContent value="engine" className="h-full m-0">
              <GameEngine isPlaying={isPlaying} />
            </TabsContent>
            
            <TabsContent value="editor" className="h-full m-0">
              <VisualEditor />
            </TabsContent>
            
            <TabsContent value="assets" className="h-full m-0">
              <AssetManager />
            </TabsContent>
            
            <TabsContent value="world" className="h-full m-0">
              <WorldBuilder />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default App