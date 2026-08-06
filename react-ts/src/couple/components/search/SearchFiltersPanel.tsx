import { Grid } from '@mui/material'
import AdvancedSearchFilters from '@/couple/components/AdvancedSearchFilters'
import type { SearchFilters } from '@/couple/components/AdvancedSearchFilters'

interface SearchFiltersPanelProps {
  onFilterChange: (filters: SearchFilters) => void
  onClear: () => void
}

export default function SearchFiltersPanel({ onFilterChange, onClear }: SearchFiltersPanelProps) {
  return (
    <Grid size={{ xs: 12, md: 3 }}>
      <AdvancedSearchFilters onFilterChange={onFilterChange} onClear={onClear} />
    </Grid>
  )
}
