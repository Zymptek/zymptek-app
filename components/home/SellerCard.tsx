"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database } from '@/lib/database.types';
import { MapPin, Building, Users, Calendar, Briefcase, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Seller } from '@/app/(protected)/sellers/types';

interface SellerCardProps {
  seller: Seller;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  const companyProfile = seller.company_profile as {
    overview?: {
      categories?: string[];
      mainProducts?: string;
      totalEmployees?: number;
      yearsExporting?: number;
      yearEstablished?: string;
    };
    company_name: string;
    company_address: string;
    company_logo_url: string;
    company_description: string;
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="transition-all duration-300"
    >
      <Link href={`/sellers/${seller.user_id}`}>
        <Card className="overflow-hidden hover:shadow-xl border-2 border-brand-100 bg-white">
          <CardHeader className="p-6 flex flex-row items-center space-x-4 bg-brand-50">
            <Avatar className="w-16 h-16 border-2 border-brand-200">
              <AvatarImage src={companyProfile.company_logo_url} alt={companyProfile.company_name || 'Company Logo'} />
              <AvatarFallback className="bg-brand-100 text-brand-700">{companyProfile.company_name?.charAt(0) || 'C'}</AvatarFallback>
            </Avatar>
              <CardTitle className="text-2xl font-bold text-brand-700">{companyProfile.company_name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {companyProfile.overview?.mainProducts && (
              <p className="text-sm text-gray-600 mb-4">{companyProfile.overview.mainProducts}</p>
            )}
            {companyProfile.company_description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{companyProfile.company_description}</p>
            )}
            <Separator className="my-4 bg-brand-100" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-brand-500" />
                <span>{companyProfile.company_address}</span>
              </div>
              {companyProfile.overview?.categories && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2 text-brand-500" />
                  <span>{companyProfile.overview.categories.join(', ')}</span>
                </div>
              )}
              {companyProfile.overview?.totalEmployees && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-brand-500" />
                  <span>{companyProfile.overview.totalEmployees} Employees</span>
                </div>
              )}
              {companyProfile.overview?.yearEstablished && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-brand-500" />
                  <span>Est. {new Date(companyProfile.overview.yearEstablished).getFullYear()}</span>
                </div>
              )}
              {companyProfile.overview?.yearsExporting && (
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2 text-brand-500" />
                  <span>{companyProfile.overview.yearsExporting} Years Exporting</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              {companyProfile.overview?.categories?.map((category, index) => (
                <Badge key={index} variant="outline" className="mr-2 border-brand-200 text-brand-700">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default SellerCard;
