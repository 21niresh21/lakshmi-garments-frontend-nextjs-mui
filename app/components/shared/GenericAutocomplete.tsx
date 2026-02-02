import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { useState } from "react";

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

export function GenericAutocomplete<T extends object>({
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
}: GenericAutocompleteProps<T>) {
  const [open, setOpen] = useState(false);
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
          setOpen(false);
          onCreateClick?.(newValue.inputValue);
          return;
        }
        onChange(newValue as T | null);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={Boolean(error)}
          helperText={error}
        />
      )}

    />
  );
}
