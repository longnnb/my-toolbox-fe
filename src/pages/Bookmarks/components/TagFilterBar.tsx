import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type Props = {
  availableTags: string[]
  activeTags: string[]
  onToggleTag: (tag: string) => void
  onClear: () => void
}

function TagFilterBar({ availableTags, activeTags, onToggleTag, onClear }: Props) {
  if (availableTags.length === 0) return null

  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
    >
      <Typography variant="body2" color="text.secondary">
        Tags:
      </Typography>
      {availableTags.map((tag) => {
        const active = activeTags.includes(tag)
        return (
          <Chip
            key={tag}
            label={tag}
            size="small"
            color={active ? 'primary' : 'default'}
            variant={active ? 'filled' : 'outlined'}
            onClick={() => onToggleTag(tag)}
          />
        )
      })}
      {activeTags.length > 0 && (
        <Chip
          label="Clear"
          size="small"
          variant="outlined"
          onClick={onClear}
        />
      )}
    </Stack>
  )
}

export default TagFilterBar
