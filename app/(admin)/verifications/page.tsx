"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Clock, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  FileText,
  Building2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";

interface VerificationTask {
  id: string;
  company_id: string;
  status: 'not_applied' | 'applied' | 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  company: {
    name: string;
    business_category: string | null;
  };
  document_count: number;
}

type FilterStatus = 'pending' | 'approved' | 'rejected' | 'all';

export default function VerificationsPage() {
  const [tasks, setTasks] = useState<VerificationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('pending');
  const [allTasks, setAllTasks] = useState<VerificationTask[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      console.log('Loading verification tasks...');
      
      // Get verification records with company info
      const { data, error } = await supabase
        .from('seller_verification_records')
        .select(`
          id,
          company_id,
          status,
          submitted_at,
          company:companies (
            name,
            business_category
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error loading verification tasks:', error);
        setLoading(false);
        return;
      }

      console.log('Verification records:', data);

      // If we have records, get document counts for each company
      if (data && data.length > 0) {
        const companyIds = data.map(record => record.company_id);
        
        // Get document counts for each company
        const { data: documentCounts, error: countError } = await supabase
          .from('company_documents')
          .select('company_id, id')
          .in('company_id', companyIds);

        if (countError) {
          console.error('Error loading document counts:', countError);
        }

        // Map document counts to verification records
        const validTasks = data
          .filter(task => 
            task.id != null &&
            task.company_id != null &&
            task.status != null &&
            task.submitted_at != null &&
            task.company != null &&
            task.company.name != null
          )
          .map(task => ({
            ...task,
            company_id: task.company_id!,
            status: task.status!,
            submitted_at: task.submitted_at!,
            company: {
              name: task.company!.name!,
              business_category: task.company!.business_category
            },
            document_count: documentCounts ? 
              documentCounts.filter(doc => doc.company_id === task.company_id).length : 
              0
          })) as VerificationTask[];

        setAllTasks(validTasks);
        filterTasks(validTasks, 'pending');
      } else {
        setAllTasks([]);
        setTasks([]);
      }
      setLoading(false);
    };

    loadTasks();
  }, []);

  const filterTasks = (tasksToFilter: VerificationTask[], filter: FilterStatus) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setTasks(tasksToFilter);
      return;
    }

    const filteredTasks = tasksToFilter.filter(task => {
      if (filter === 'pending') return task.status === 'applied' || task.status === 'pending';
      return task.status === filter;
    });
    setTasks(filteredTasks);
  };

  const getStatusCounts = () => {
    const pending = allTasks.filter(task => task.status === 'applied' || task.status === 'pending').length;
    const approved = allTasks.filter(task => task.status === 'approved').length;
    const rejected = allTasks.filter(task => task.status === 'rejected').length;
    return { pending, approved, rejected };
  };

  const counts = getStatusCounts();

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Verification Tasks</h1>
          <p className="text-muted-foreground">Review and verify seller documents</p>
        </div>
      </div>

      {/* Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className={`bg-gradient-to-br cursor-pointer transition-all duration-200 border-0 shadow-lg
            ${activeFilter === 'pending' 
              ? 'from-white to-yellow-100 ring-2 ring-yellow-200' 
              : 'from-white to-yellow-100/10 hover:to-yellow-100/30'}`}
          onClick={() => filterTasks(allTasks, 'pending')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{counts.pending}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-to-br cursor-pointer transition-all duration-200 border-0 shadow-lg
            ${activeFilter === 'approved' 
              ? 'from-white to-green-100 ring-2 ring-green-200' 
              : 'from-white to-green-100/10 hover:to-green-100/30'}`}
          onClick={() => filterTasks(allTasks, 'approved')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-green-600">{counts.approved}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-to-br cursor-pointer transition-all duration-200 border-0 shadow-lg
            ${activeFilter === 'rejected' 
              ? 'from-white to-red-100 ring-2 ring-red-200' 
              : 'from-white to-red-100/10 hover:to-red-100/30'}`}
          onClick={() => filterTasks(allTasks, 'rejected')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{counts.rejected}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <X className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Tasks Table */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Verifications
            </CardTitle>
            <CardDescription>
              {activeFilter === 'pending' && 'Review and process seller verification requests'}
              {activeFilter === 'approved' && 'Previously approved verifications'}
              {activeFilter === 'rejected' && 'Previously rejected verifications'}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className={`border-brand-200 text-brand-200 hover:bg-brand-100/10
              ${activeFilter === 'all' ? 'bg-brand-100/10' : ''}`}
            onClick={() => filterTasks(allTasks, 'all')}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-100/5 hover:bg-brand-100/5">
                    <TableHead className="w-[300px]">Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-brand-100/5">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold text-brand-800">{task.company.name}</span>
                          <span className="text-sm text-muted-foreground">{task.company.business_category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            task.status === 'approved'
                              ? "bg-green-100 text-green-800"
                              : task.status === 'rejected'
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {task.status === 'approved' ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : task.status === 'rejected' ? (
                            <X className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-brand-200" />
                          <span>{task.document_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-brand-200" />
                          <span>{new Date(task.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/verifications/${task.company_id}`}>
                          <Button variant="outline" className="border-brand-200 text-brand-200 hover:bg-brand-100/10">
                            {task.status === 'approved' ? 'View Details' : 'Review'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : !loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No {activeFilter} verifications</h3>
              <p className="text-muted-foreground max-w-sm">
                {activeFilter === 'pending' 
                  ? 'There are no pending verification tasks at the moment.'
                  : activeFilter === 'approved'
                  ? 'No verifications have been approved yet.'
                  : activeFilter === 'rejected'
                  ? 'No verifications have been rejected yet.'
                  : 'No verification records found.'}
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-200 border-t-transparent"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 

