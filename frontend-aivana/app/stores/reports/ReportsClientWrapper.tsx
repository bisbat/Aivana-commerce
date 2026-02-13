"use client";

import { useEffect, useRef } from "react";
import DeletedProductsAlert from "@/components/seller/DeletedProductsAlert";
import { useDeletedProductsNotification } from "@/hooks/useDeletedProductsNotification";

interface ReportsClientWrapperProps {
  deletedProductIds: number[];
}

export default function ReportsClientWrapper({
  deletedProductIds,
}: ReportsClientWrapperProps) {
  const { markAsViewed, dismissAlert, shouldShowAlert } =
    useDeletedProductsNotification();
  const hasMarkedRef = useRef(false);

  // Mark as viewed when user enters the page (only once)
  useEffect(() => {
    if (deletedProductIds.length > 0 && !hasMarkedRef.current) {
      console.log(
        "ReportsClientWrapper - Marking as viewed:",
        deletedProductIds,
      );

      // Mark as viewed after a short delay (user has seen the page)
      const timer = setTimeout(() => {
        markAsViewed(deletedProductIds);
        hasMarkedRef.current = true;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [deletedProductIds.length]); // Only depend on length to avoid re-running

  const handleDismiss = () => {
    console.log("ReportsClientWrapper - Dismissing alert");
    dismissAlert(deletedProductIds);
  };

  return (
    <DeletedProductsAlert
      deletedProductIds={deletedProductIds}
      shouldShow={shouldShowAlert(deletedProductIds)}
      onDismiss={handleDismiss}
    />
  );
}
