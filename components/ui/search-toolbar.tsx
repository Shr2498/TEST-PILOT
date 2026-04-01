'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface SearchToolbarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: FilterOption[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string | null) => void
  showFilterToggle?: boolean
  onExport?: () => void
  className?: string
}

export function SearchToolbar({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  showFilterToggle = false,
  onExport,
  className
}: SearchToolbarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchValue)

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    onSearchChange?.(value)
  }

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange?.(key, value === 'all' ? null : value)
  }

  const clearFilter = (key: string) => {
    onFilterChange?.(key, null)
  }

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main toolbar */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter toggle */}
        {showFilterToggle && filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}

        {/* Export */}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            Export
          </Button>
        )}
      </div>

      {/* Filters */}
      {(showFilters || !showFilterToggle) && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={activeFilters[filter.key] || 'all'}
              onValueChange={(value) => handleFilterChange(filter.key, value)}
            >
              <SelectTrigger className="w-auto min-w-32">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}

      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(activeFilters)
            .filter(([_, value]) => value)
            .map(([key, value]) => {
              const filter = filters.find(f => f.key === key)
              const option = filter?.options.find(o => o.value === value)
              return (
                <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                  <span>{filter?.label}: {option?.label}</span>
                  <button
                    onClick={() => clearFilter(key)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
        </div>
      )}
    </div>
  )
}