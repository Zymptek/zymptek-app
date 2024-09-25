import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface OrderManagementProps {
  userType: string;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ userType }) => {

  const renderTabs = () => {
    if (userType === 'SELLER') {
      return (
        <>
          <TabsTrigger value="recent" className="rounded-xl data-[state=active]:bg-white">Recent</TabsTrigger>
          <TabsTrigger value="processed" className="rounded-xl data-[state=active]:bg-white">Processed</TabsTrigger>
          <TabsTrigger value="finished" className="rounded-xl data-[state=active]:bg-white">Finished</TabsTrigger>
        </>
      );
    } else {
      return (
        <>
          <TabsTrigger value="delivering" className="rounded-xl data-[state=active]:bg-white">In Transit</TabsTrigger>
          <TabsTrigger value="received" className="rounded-xl data-[state=active]:bg-white">Delivered</TabsTrigger>
        </>
      );
    }
  };

  const renderTabContent = () => {
    if (userType === 'SELLER') {
      return (
        <>
          <TabsContent value="recent">
            <Card>
              <CardContent className="pt-6">
                <p>Recent orders content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="processed">
            <Card>
              <CardContent className="pt-6">
                <p>Processed orders content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="finished">
            <Card>
              <CardContent className="pt-6">
                <p>Finished orders content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </>
      );
    } else {
      return (
        <>
          <TabsContent value="delivering">
            <Card>
              <CardContent className="pt-6">
                <p>No in transit orders at the moment.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="received">
            <Card>
              <CardContent className="pt-6">
                <p>No delivered orders yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </>
      );
    }
  };

  return (
    <Tabs defaultValue="recent" className="w-full">
      {userType === 'SELLER' ? (
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-brand-500">
          {renderTabs()}
        </TabsList>
      ) : (
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-brand-500">
          {renderTabs()}
        </TabsList>
      )}
      {renderTabContent()}
    </Tabs>
  );
};


export default OrderManagement;
