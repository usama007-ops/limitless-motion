import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecoveryFlows } from '@/db';

const RecoveryFlowLibrary = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const records = await getRecoveryFlows();
        setFlows(records);
      } catch (error) {
        console.error('Error fetching recovery flows:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlows();
  }, []);

  if (loading) {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl break-inside-avoid" />)}
      </div>
    );
  }

  if (flows.length === 0) {
    return (
      <div className="bg-muted/30 rounded-2xl p-12 text-center border border-border border-dashed">
        <HeartPulse className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground">No recovery flows available</p>
        <p className="text-muted-foreground mt-2">Check back soon for guided mobility and stretch routines.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Active Recovery</h2>
        <p className="text-xl text-muted-foreground leading-relaxed">Restore your muscles, improve flexibility, and prevent injury with these targeted flows designed for active recovery days.</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {flows.map((flow, index) => (
          <motion.div
            key={flow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="break-inside-avoid"
          >
            <Card className="h-full bg-card hover:shadow-lg transition-all duration-300 border-border/60 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-muted/30 pb-5 border-b border-border/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <Badge variant="outline" className="capitalize bg-background font-semibold tracking-wide border-border/80 shadow-sm">
                    {flow.type}
                  </Badge>
                  {flow.duration && (
                    <span className="flex items-center text-xs font-bold text-foreground/70 bg-background px-2 py-1 rounded-md border border-border/50 shadow-sm">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" /> {flow.duration} min
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl leading-tight font-bold group-hover:text-primary transition-colors relative z-10">{flow.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {flow.instructions && (
                  <div className="mb-6 flex items-start gap-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                    <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">{flow.instructions}</p>
                  </div>
                )}
                
                {flow.stretches && flow.stretches.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center">
                      <span className="bg-border h-px flex-grow mr-3"></span>
                      Movements
                      <span className="bg-border h-px flex-grow ml-3"></span>
                    </h4>
                    <ul className="space-y-2">
                      {flow.stretches.map((stretch, i) => (
                        <li key={i} className="text-sm flex items-center justify-between p-3 rounded-lg bg-background border border-border/50 shadow-sm">
                          <span className="font-semibold text-foreground/90">{stretch.name || stretch}</span>
                          {stretch.duration && <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded">{stretch.duration}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecoveryFlowLibrary;
