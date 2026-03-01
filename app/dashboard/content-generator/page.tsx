 



// 'use client'

// import { useState } from 'react'
// import { Card } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Sparkles, Copy } from 'lucide-react'
// import { PLATFORMS } from '@/lib/mock-data'

// export default function ContentGeneratorPage() {
//   const [selectedPlatform, setSelectedPlatform] = useState<string | null>('instagram')
//   const [topic, setTopic] = useState('')
//   const [videoURL, setVideoURL] = useState('')
//   const [generated, setGenerated] = useState(false)
//   const [output, setOutput] = useState('')
//   const [videoUrl, setVideoUrl] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [tone, setTone] = useState('Professional')
//   const [contentLength, setContentLength] = useState('Medium')
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)

//   const [mainType, setMainType] = useState('Text')
//   const [subType, setSubType] = useState('Paragraph')
//   const [fileData, setFileData] = useState<string | null>(null)

//   // ✅ Updated Format Options
//   const subTypeOptions: Record<string, string[]> = {
//     Text: ['Paragraph', 'Hashtags', 'Thumbnail', 'Description', 'Video Generation'],
//     Video: ['Paragraph', 'Hashtags', 'Video Generation', 'Description'],
//     Audio: ['Audio Script']
//   }

//   const buttonStyle = (active: boolean) =>
//     `p-3 rounded-lg border-2 transition-all font-medium text-sm ${
//       active
//         ? 'border-primary bg-primary/10 text-primary'
//         : 'border-border hover:border-primary/50 text-foreground'
//     }`

//   const convertToBase64 = (file: File) =>
//     new Promise<string>((resolve, reject) => {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onload = () => resolve(reader.result as string)
//       reader.onerror = error => reject(error)
//     })

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return
//     const base64 = await convertToBase64(file)
//     setFileData(base64)
//     setVideoURL('')
//   }

//   const handleGenerate = async () => {
//     try {
//       setLoading(true)
//       setGenerated(false)
//       setErrorMessage(null)

//       if (mainType === 'Text' && !topic.trim())
//         throw new Error('Please enter a prompt')

//       if (mainType === 'Video' && !fileData && !videoURL)
//         throw new Error('Upload a video or paste a video URL')

//       const response = await fetch('/api/generate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           text: mainType === 'Video' ? videoURL : topic,
//           platform: selectedPlatform,
//           tone,
//           length: contentLength,
//           mainType,
//           subType,
//           fileData
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok)
//         throw new Error(data.error || 'Generation failed')

//       setOutput(data.output?.trim() || '')
//       setVideoUrl(data.videoUrl || null)
//       setGenerated(true)

//     } catch (error: any) {
//       setErrorMessage(error.message || 'Error generating content')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCopy = () => {
//     navigator.clipboard.writeText(output)
//   }

//   return (
//     <div className="space-y-6 pb-12">

//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Content Generator</h1>
//         <p className="text-muted-foreground mt-1">
//           Generate content or AI video from text or video input.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         <Card className="lg:col-span-2 p-8">
//           <h2 className="text-lg font-semibold mb-6">Generate New Content</h2>

//           {/* Platform */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-3">Select Platform</label>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//               {PLATFORMS.map((platform) => (
//                 <button
//                   key={platform.id}
//                   onClick={() => setSelectedPlatform(platform.id)}
//                   className={buttonStyle(selectedPlatform === platform.id)}
//                 >
//                   {platform.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Main Type */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-3">Main Type</label>
//             <div className="grid grid-cols-3 gap-2">
//               {['Text', 'Video', 'Audio'].map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => {
//                     setMainType(type)
//                     setSubType(subTypeOptions[type][0])
//                     setFileData(null)
//                     setVideoURL('')
//                   }}
//                   className={buttonStyle(mainType === type)}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* TEXT INPUT */}
//           {mainType === 'Text' && (
//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-2">
//                 Prompt or Topic
//               </label>
//               <textarea
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 rows={4}
//                 className="w-full px-4 py-3 rounded-lg border border-border bg-secondary resize-none"
//               />
//             </div>
//           )}

//           {/* VIDEO INPUT */}
//           {mainType === 'Video' && (
//             <div className="mb-6 space-y-4">
//               <label className="block text-sm font-medium">
//                 Upload Video File
//               </label>

//               <input
//                 type="file"
//                 accept="video/*"
//                 onChange={handleFileUpload}
//                 className="w-full"
//               />

//               <p className="text-xs text-muted-foreground">
//                 Supported formats: MP4, MOV, WebM (Max 20MB recommended)
//               </p>
//             </div>
//           )}

//           {/* Format */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-3">Format</label>
//             <div className="grid grid-cols-2 gap-2">
//               {subTypeOptions[mainType].map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => setSubType(type)}
//                   className={buttonStyle(subType === type)}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Tone */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-3">Tone</label>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//               {['Professional', 'Casual', 'Humorous', 'Inspirational'].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setTone(t)}
//                   className={buttonStyle(tone === t)}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Length */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-3">Content Length</label>
//             <div className="grid grid-cols-3 gap-2">
//               {['Short', 'Medium', 'Long'].map((len) => (
//                 <button
//                   key={len}
//                   onClick={() => setContentLength(len)}
//                   className={buttonStyle(contentLength === len)}
//                 >
//                   {len}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {errorMessage && (
//             <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
//           )}

//           <Button onClick={handleGenerate} className="w-full" size="lg" disabled={loading}>
//             <Sparkles size={18} className="mr-2" />
//             {loading ? 'Generating...' : 'Generate Content'}
//           </Button>
//         </Card>
//       </div>

//       {/* OUTPUT */}
//       {generated && (
//         <Card className="p-6 mt-6 space-y-6">

//           {videoUrl && (
//             <video
//               src={videoUrl}
//               controls
//               autoPlay
//               className="w-full rounded-lg"
//             />
//           )}

//           {output && (
//             <div className="whitespace-pre-wrap text-foreground">
//               {output}
//             </div>
//           )}

//           {output && (
//             <Button onClick={handleCopy}>
//               <Copy size={16} className="mr-2" />
//               Copy to Clipboard
//             </Button>
//           )}

//         </Card>
//       )}
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Copy } from 'lucide-react'
import { PLATFORMS } from '@/lib/mock-data'

export default function ContentGeneratorPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('instagram')
  const [topic, setTopic] = useState('')
  const [videoURL, setVideoURL] = useState('')
  const [generated, setGenerated] = useState(false)
  const [output, setOutput] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null) // ✅ NEW
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState('Professional')
  const [contentLength, setContentLength] = useState('Medium')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [mainType, setMainType] = useState('Text')
  const [subType, setSubType] = useState('Paragraph')
  const [fileData, setFileData] = useState<string | null>(null)

  // ✅ Updated Format Options
  const subTypeOptions: Record<string, string[]> = {
    Text: ['Paragraph', 'Hashtags', 'Thumbnail', 'Description', 'Image'], // ✅ ADDED IMAGE
    Video: ['Paragraph', 'Hashtags', 'Video Generation', 'Description'],
    Audio: ['Audio Script']
  }

  const buttonStyle = (active: boolean) =>
    `p-3 rounded-lg border-2 transition-all font-medium text-sm ${
      active
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border hover:border-primary/50 text-foreground'
    }`

  const convertToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await convertToBase64(file)
    setFileData(base64)
    setVideoURL('')
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setGenerated(false)
      setErrorMessage(null)
      setImage(null) // ✅ RESET IMAGE

      if (mainType === 'Text' && !topic.trim())
        throw new Error('Please enter a prompt')

      if (mainType === 'Video' && !fileData && !videoURL)
        throw new Error('Upload a video or paste a video URL')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: mainType === 'Video' ? videoURL : topic,
          platform: selectedPlatform,
          tone,
          length: contentLength,
          mainType,
          subType,
          fileData
        }),
      })

      const data = await response.json()

      if (!response.ok)
        throw new Error(data.error || 'Generation failed')

      setOutput(data.output?.trim() || '')
      setVideoUrl(data.videoUrl || null)
      setImage(data.image || null) // ✅ HANDLE IMAGE RESPONSE
      setGenerated(true)

    } catch (error: any) {
      setErrorMessage(error.message || 'Error generating content')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="space-y-6 pb-12">

      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Generator</h1>
        <p className="text-muted-foreground mt-1">
          Generate content or AI image from text input.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2 p-8">
          <h2 className="text-lg font-semibold mb-6">Generate New Content</h2>

          {/* Platform */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Select Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={buttonStyle(selectedPlatform === platform.id)}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Main Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Text', 'Video', 'Audio'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setMainType(type)
                    setSubType(subTypeOptions[type][0])
                    setFileData(null)
                    setVideoURL('')
                    setImage(null)
                  }}
                  className={buttonStyle(mainType === type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* TEXT INPUT */}
          {mainType === 'Text' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Prompt or Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary resize-none"
              />
            </div>
          )}

          {/* Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Format</label>
            <div className="grid grid-cols-2 gap-2">
              {subTypeOptions[mainType].map((type) => (
                <button
                  key={type}
                  onClick={() => setSubType(type)}
                  className={buttonStyle(subType === type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Professional', 'Casual', 'Humorous', 'Inspirational'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={buttonStyle(tone === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Content Length</label>
            <div className="grid grid-cols-3 gap-2">
              {['Short', 'Medium', 'Long'].map((len) => (
                <button
                  key={len}
                  onClick={() => setContentLength(len)}
                  className={buttonStyle(contentLength === len)}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
          )}

          <Button onClick={handleGenerate} className="w-full" size="lg" disabled={loading}>
            <Sparkles size={18} className="mr-2" />
            {loading ? 'Generating...' : 'Generate Content'}
          </Button>
        </Card>
      </div>

      {/* OUTPUT */}
      {generated && (
        <Card className="p-6 mt-6 space-y-6">

          {videoUrl && (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          )}

          {/* ✅ IMAGE DISPLAY */}
          {image && (
            <img
              src={image}
              alt="Generated"
              className="w-full rounded-lg"
            />
          )}

          {output && (
            <div className="whitespace-pre-wrap text-foreground">
              {output}
            </div>
          )}

          {output && (
            <Button onClick={handleCopy}>
              <Copy size={16} className="mr-2" />
              Copy to Clipboard
            </Button>
          )}

        </Card>
      )}
    </div>
  )
}