import { Autocomplete, TextField, createFilterOptions, Box } from "@mui/material";
import { useState, useRef, useImperativeHandle, forwardRef } from "react";

type CreateOption = {
  inputValue: string;
  isCreate: true;
};

type AutocompleteOption<T extends object> = T | CreateOption;

type GenericAutocompleteProps<T extends object> = {
  label: string;
  placeholder?: string;
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;

  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;

  allowCreate?: boolean;
  onCreateClick?: (inputValue: string) => void;

  size?: "small" | "medium";
  sx?: any;

  loading?: boolean;
  error?: string;
};

const filter = createFilterOptions<AutocompleteOption<any>>();

const GenericAutocompleteInner = forwardRef(function GenericAutocomplete<T extends object>(
  {
    label,
    placeholder,
    options,
    value,
    onChange,
    getOptionLabel,
    isOptionEqualToValue,
    allowCreate = false,
    onCreateClick,
    size,
    sx,
    error,
    loading = false,
  }: GenericAutocompleteProps<T>,
  ref: React.Ref<any>
) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    }
  }));

  return (
    <Autocomplete<AutocompleteOption<T>, false, false, false>
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      id={label}
      sx={sx}
      size={size}
      autoHighlight
      loading={loading}
      openOnFocus
      options={options as AutocompleteOption<T>[]}
      value={value as AutocompleteOption<T> | null}
      filterOptions={(opts, params) => {
        const filtered = filter(opts, params);

        if (
          allowCreate &&
          params.inputValue !== "" &&
          !opts.some(
            (opt) =>
              !("isCreate" in opt) &&
              getOptionLabel(opt).toLowerCase() ===
                params.inputValue.toLowerCase()
          )
        ) {
          filtered.push({
            inputValue: params.inputValue,
            isCreate: true,
          });
        }

        return filtered;
      }}
      getOptionLabel={(option) => {
        if ("isCreate" in option) {
          return `Add "${option.inputValue}"`;
        }
        return getOptionLabel(option);
      }}
      isOptionEqualToValue={(opt, val) =>
        "isCreate" in opt || "isCreate" in val
          ? false
          : isOptionEqualToValue?.(opt, val) ?? false
      }
      onChange={(_, newValue) => {
        if (newValue && "isCreate" in newValue) {
          // Force dropdown close by blurring input
          inputRef.current?.blur();
          setOpen(false);
          onCreateClick?.(newValue.inputValue);
          return;
        }
        onChange(newValue as T | null);
      }}
      renderInput={(params) => (
        <Box sx={{ position: 'relative' }}>
          <TextField
              {...params}
              inputRef={inputRef}
              label={label}
              placeholder={placeholder}
              error={Boolean(error)}
              helperText={error}
          />
        </Box>
      )}
    />
  );
});

export const GenericAutocomplete = GenericAutocompleteInner as <T extends object>(
  props: GenericAutocompleteProps<T> & { ref?: React.Ref<any> }
) => React.ReactElement;
