import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DetailModal } from "@/components/details/DetailModal";
import { DetailContent } from "@/components/details/DetailContent";
import { resourceDetails } from "@/lib/detailsData";
import type { ResourceDetail } from '@/lib/types';

interface ResourceAllocationProps {
  type: 'humanResource' | 'equipment';
  title: string;
  total: number;
  allocated: number;
  available: number;
}

export function ResourceAllocation({ 
  type, 
  title, 
  total, 
  allocated, 
  available 
}: ResourceAllocationProps) {
  const [showDetail, setShowDetail] = useState(false);

  const handleClick = () => {
    setShowDetail(true);
  };

  const allocationPercentage = (allocated / total) * 100;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <>
      <Card 
        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleClick}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{title}</h3>
            <span className={getStatusColor(allocationPercentage)}>
              {allocationPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={allocationPercentage} className="h-2" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">总量</p>
              <p className="font-medium">{total}</p>
            </div>
            <div>
              <p className="text-muted-foreground">已分配</p>
              <p className="font-medium">{allocated}</p>
            </div>
            <div>
              <p className="text-muted-foreground">可用</p>
              <p className="font-medium">{available}</p>
            </div>
          </div>
        </div>
      </Card>

      <DetailModal
        title={`${title}分配详情`}
        description="查看资源分配的详细信息"
        open={showDetail}
        onClose={() => setShowDetail(false)}
      >
        <DetailContent
          type="resource"
          data={resourceDetails[type] as ResourceDetail}
        />
      </DetailModal>
    </>
  );
} 