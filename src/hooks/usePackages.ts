"use client";
import { useState, useEffect, useCallback } from "react";
import { IPackage, PackageFilters }          from "@/types";
import { packagesApi }                       from "@/utils/api";

interface UsePackagesReturn {
  packages: IPackage[];
  loading:  boolean;
  error:    string | null;
  total:    number;
  pages:    number;
  refetch:  () => void;
}

export function usePackages(filters: PackageFilters = {}): UsePackagesReturn {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);

  const key = JSON.stringify(filters);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await packagesApi.getAll(filters) as {
        data: IPackage[]; total: number; pages: number;
      };
      setPackages(res.data ?? []);
      setTotal(res.total ?? 0);
      setPages(res.pages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load packages");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { packages, loading, error, total, pages, refetch: fetch_ };
}
