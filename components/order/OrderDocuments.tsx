import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Check } from 'lucide-react'

interface OrderDocumentsProps {
  orderId: string
}

export const OrderDocuments = ({ orderId }: OrderDocumentsProps) => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Purchase Agreement', status: 'pending' },
    { id: 2, name: 'Shipping Documents', status: 'completed' },
  ])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDocuments(prev => [
        ...prev,
        { id: Date.now(), name: file.name, status: 'completed' }
      ])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span>{doc.name}</span>
                </div>
                {doc.status === 'completed' ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="w-full" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Document
                </span>
              </Button>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
