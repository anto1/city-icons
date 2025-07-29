interface SearchResultsCountProps {
  filteredIcons: any[];
  totalIcons: number;
}

export function SearchResultsCount({ filteredIcons, totalIcons }: SearchResultsCountProps) {
  if (filteredIcons.length === totalIcons) {
    return null;
  }

  return (
    <div className="text-center mt-4">
      <p className="text-sm text-muted-foreground">
        Found {filteredIcons.length} of {totalIcons} icons
      </p>
    </div>
  );
} 