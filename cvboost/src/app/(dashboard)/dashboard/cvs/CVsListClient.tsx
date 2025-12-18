'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  FileText, 
  Plus, 
  Eye, 
  Download, 
  Trash2,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from '@/lib/utils'
import type { GeneratedCV } from '@/types'

interface CVsListClientProps {
  cvs: GeneratedCV[]
}

export default function CVsListClient({ cvs: initialCVs }: CVsListClientProps) {
  const [cvs, setCVs] = useState(initialCVs)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cvToDelete, setCVToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredCVs = cvs.filter(cv => {
    const matchesSearch = 
      (cv.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (cv.job_company?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    const matchesStatus = statusFilter === 'all' || cv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async () => {
    if (!cvToDelete) return
    
    setIsDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('generated_cvs')
        .delete()
        .eq('id', cvToDelete)

      if (error) throw error

      setCVs(cvs.filter(cv => cv.id !== cvToDelete))
      toast.success('CV deleted successfully')
    } catch (error) {
      toast.error('Failed to delete CV')
      console.error(error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setCVToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Completed</Badge>
      case 'processing':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Failed</Badge>
      default:
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Pending</Badge>
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My CVs</h1>
            <p className="text-muted-foreground">
              {cvs.length} CV{cvs.length !== 1 ? 's' : ''} generated
            </p>
          </div>
          <Link href="/create">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Create New CV
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by job title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CV List */}
        {filteredCVs.length > 0 ? (
          <div className="grid gap-4">
            {filteredCVs.map((cv, index) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-card border-border hover:border-indigo-500/30 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          cv.status === 'completed' 
                            ? 'bg-green-500/10' 
                            : cv.status === 'processing'
                            ? 'bg-yellow-500/10'
                            : cv.status === 'failed'
                            ? 'bg-red-500/10'
                            : 'bg-gray-500/10'
                        }`}>
                          {cv.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                          {cv.status === 'processing' && <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />}
                          {cv.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-400" />}
                          {cv.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-medium truncate">
                              {cv.job_title || 'Untitled Position'}
                            </h3>
                            {getStatusBadge(cv.status)}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {cv.job_company || 'Company not specified'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(cv.created_at))}
                            </span>
                            {cv.ats_score && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-green-400" />
                                {cv.ats_score}% ATS Score
                              </span>
                            )}
                            <Badge variant="secondary" className="text-xs capitalize">
                              {cv.template_style}
                            </Badge>
                            {cv.is_anonymous && (
                              <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {cv.status === 'completed' && (
                          <>
                            <Link href={`/cv/${cv.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-muted-foreground hover:text-red-400"
                          onClick={() => {
                            setCVToDelete(cv.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {cv.ats_score && cv.status === 'completed' && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">ATS Compatibility</span>
                          <span className={`font-medium ${
                            cv.ats_score >= 80 ? 'text-green-400' :
                            cv.ats_score >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {cv.ats_score}%
                          </span>
                        </div>
                        <Progress value={cv.ats_score} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No CVs match your filters'
                    : 'No CVs created yet'
                  }
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first optimized CV by uploading your resume and a job description.'
                  }
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First CV
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete CV</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this CV? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


