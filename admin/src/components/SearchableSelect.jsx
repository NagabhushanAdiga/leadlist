import { Autocomplete, Box, TextField } from '@mui/material'

const SAME_WIDTH_POPPER_MODIFIER = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['computeStyles'],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`
  },
}

function normalizeOptions(options) {
  return options.map((option) => {
    if (typeof option === 'string') {
      return { value: option, label: option }
    }

    return option
  })
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  size = 'small',
  fullWidth = false,
  minWidth = 240,
  sx,
  boxSx,
  disabled = false,
  required = false,
  textFieldSx,
  placeholder,
  hideLabel = false,
}) {
  const items = normalizeOptions(options)
  const selected = items.find((item) => item.value === value) ?? null

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : { xs: '100%', sm: minWidth },
        minWidth: fullWidth ? 0 : { xs: '100%', sm: minWidth },
        maxWidth: '100%',
        flex: fullWidth ? '1 1 auto' : '0 0 auto',
        ...boxSx,
      }}
    >
      <Autocomplete
        size={size}
        fullWidth
        disabled={disabled}
        options={items}
        value={selected}
        onChange={(_, option) => onChange(option?.value ?? '')}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        slotProps={{
          popper: {
            modifiers: [SAME_WIDTH_POPPER_MODIFIER],
          },
        }}
        sx={{ width: '100%', ...sx }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={hideLabel ? undefined : label}
            placeholder={hideLabel ? placeholder || label : placeholder}
            required={required}
            sx={textFieldSx}
          />
        )}
      />
    </Box>
  )
}

export function buildUserOptions(users, { includeAll = false, allLabel = 'All users', showEmail = false } = {}) {
  const items = []

  if (includeAll) {
    items.push({ value: 'All', label: allLabel })
  }

  users.forEach((user) => {
    items.push({
      value: user.id,
      label: showEmail ? `${user.name} (${user.email})` : user.name,
    })
  })

  return items
}

export function buildLabelOptions(values, { includeAll = false, allLabel = 'All', formatLabel } = {}) {
  const items = []

  if (includeAll) {
    items.push({ value: 'All', label: allLabel })
  }

  values.forEach((value) => {
    items.push({
      value,
      label: formatLabel ? formatLabel(value) : value,
    })
  })

  return items
}
