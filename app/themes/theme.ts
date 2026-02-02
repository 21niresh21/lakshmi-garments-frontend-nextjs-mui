import { ThemeOptions, alpha } from '@mui/material/styles';
import { ThemeConfiguration } from '@/app/context/ThemeContext';

export type ThemeStyle = 'standard' | 'glass' | 'flat' | 'frosted';

export const getThemeOptions = (config: ThemeConfiguration): ThemeOptions => {
    const isDark = config.mode === 'dark';

    const brandPrimary = {
        main: config.primaryMain,
        light: config.primaryLight,
        dark: config.primaryDark,
        contrastText: '#ffffff',
    };

    const brandSecondary = {
        main: config.secondaryMain,
        contrastText: '#ffffff',
    };

    const basePalette = isDark ? {
        primary: brandPrimary,
        secondary: brandSecondary,
        background: {
            default: '#0f172a', // Slate 900
            paper: '#1e293b',   // Slate 800 (Lighter for cards)
        },
        text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1', // Lighter Slate 300 for better contrast
        },
        divider: 'rgba(255, 255, 255, 0.08)',
    } : {
        primary: brandPrimary,
        secondary: brandSecondary,
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
        },
        divider: 'rgba(0, 0, 0, 0.08)',
    };

    const style = config.themeStyle as ThemeStyle;

    // Helper for consistent input styling
    const getInputStyles = (theme: any) => ({
        borderRadius: (style === 'flat' ? 0 : (style === 'glass' || style === 'frosted' ? Math.max(12, config.borderRadius * 1.5) : config.borderRadius)) + 'px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: (style === 'glass' || style === 'frosted')
            ? alpha(theme.palette.background.paper, style === 'frosted' ? 0.6 : 0.4)
            : theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.common.white, 1.0),
        backdropFilter: style === 'frosted' ? 'blur(20px)' : (style === 'glass' ? 'blur(12px)' : 'none'),
        '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: (style === 'flat' ? 0 : (style === 'glass' || style === 'frosted' ? Math.max(12, config.borderRadius * 1.5) : config.borderRadius)) + 'px',
            borderWidth: style === 'flat' ? 2 : 1,
            borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.text.primary, 0.1) : alpha(theme.palette.primary.main, 0.2),
            transition: 'all 0.2s ease',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.primary.main, 0.5),
            borderWidth: style === 'flat' ? 2 : 1,
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: style === 'flat' ? 'none' : `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
            '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: theme.palette.primary.main,
            },
        },
    });

    const getPaperStyles = (theme: any) => ({
        backgroundImage: 'none',
        borderRadius: style === 'flat' ? 0 : (style === 'glass' || style === 'frosted' ? Math.max(16, config.borderRadius * 2) : config.borderRadius),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: style === 'flat'
            ? `2px solid ${theme.palette.divider}`
            : (style === 'glass' || style === 'frosted' ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : `1px solid ${theme.palette.divider}`),
        boxShadow: style === 'flat'
            ? 'none'
            : theme.palette.mode === 'dark'
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
        ...((style === 'glass' || style === 'frosted') && {
            background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, style === 'frosted' ? 0.9 : 0.8)} 0%, ${alpha(theme.palette.background.paper, style === 'frosted' ? 0.6 : 0.4)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', style === 'frosted' ? 0.9 : 0.8)} 0%, ${alpha('#ffffff', style === 'frosted' ? 0.6 : 0.4)} 100%)`,
            backdropFilter: style === 'frosted' ? 'blur(40px) saturate(200%)' : 'blur(24px) saturate(180%)',
        }),
    });

    return {
        palette: {
            mode: config.mode,
            ...basePalette,
        },
        typography: {
            fontFamily: config.fontFamily,
            fontWeightRegular: config.fontWeight,
            fontWeightMedium: config.fontWeight + 100,
            fontWeightBold: Math.min(900, config.fontWeight + 300),
            h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
            h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
            h3: { fontSize: '1.75rem', fontWeight: 700 },
            h4: { fontSize: '1.5rem', fontWeight: 600 },
            h5: { fontSize: '1.25rem', fontWeight: 600 },
            h6: { fontSize: '1.1rem', fontWeight: 600 },
            button: { textTransform: 'none', fontWeight: 600 },
            fontSize: config.fontSize,
        },
        shape: {
            borderRadius: style === 'flat' ? 0 : config.borderRadius,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    },
                    '.MuiOutlinedInput-root, .MuiInputBase-root, .MuiPickersTextField-root, .MuiDateField-root, .MuiTimeField-root, .MuiDateTimeField-root': {
                        borderRadius: (style === 'flat' ? 0 : (style === 'glass' || style === 'frosted' ? Math.max(12, config.borderRadius * 1.5) : config.borderRadius)) + 'px !important',
                        backgroundColor: ((style === 'glass' || style === 'frosted')
                            ? alpha(basePalette.background.paper, style === 'frosted' ? 0.6 : 0.4)
                            : config.mode === 'dark' ? alpha(basePalette.background.paper, 0.6) : alpha('#ffffff', 1.0)) + ' !important',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderRadius: (style === 'flat' ? 0 : (style === 'glass' || style === 'frosted' ? Math.max(12, config.borderRadius * 1.5) : config.borderRadius)) + 'px !important',
                        }
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        borderRadius: style === 'flat' ? 0 : config.borderRadius,
                        boxShadow: 'none',
                        transition: 'all 0.2s ease-in-out',
                        padding: style === 'standard' ? '8px 20px' : (config.compactMode ? '4px 12px' : undefined),
                        border: style === 'flat' ? `2px solid ${theme.palette.primary.main}` : 'none',
                        '&:hover': {
                            boxShadow: style === 'flat' ? 'none' : '0 4px 12px 0 rgba(0,0,0,0.1)',
                            transform: style === 'flat' ? 'none' : 'translateY(-1px)',
                            backgroundColor: style === 'flat' ? theme.palette.primary.dark : undefined,
                        },
                    }),
                },
                defaultProps: {
                    size: config.compactMode ? "small" : "medium",
                },
            },
            MuiTextField: {
                defaultProps: {
                    variant: 'outlined',
                    size: config.compactMode ? "small" : "medium",
                },
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary,
                            '&.Mui-focused': {
                                color: theme.palette.primary.main,
                            },
                        },
                    }),
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }: any) => getInputStyles(theme),
                    notchedOutline: ({ theme }: any) => ({
                        borderRadius: (style === 'flat' ? 0 : (style === 'glass' || style === 'frosted' ? Math.max(12, config.borderRadius * 1.5) : config.borderRadius)) + 'px !important',
                    }),
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        fontSize: config.fontSize,
                        "&.MuiOutlinedInput-root": getInputStyles(theme),
                        "& input[type=number]": {
                            "MozAppearance": "textfield",
                            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "WebkitAppearance": "none",
                                margin: 0,
                            },
                        },
                    }),
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        color: theme.palette.text.secondary,
                    }),
                    shrink: ({ theme }: any) => ({
                        padding: '0 8px',
                        marginLeft: -4,
                        background: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                        borderRadius: 4,
                        zIndex: 1,
                        ...(style === 'frosted' && {
                            backdropFilter: 'blur(20px)',
                            background: theme.palette.mode === 'dark' ? alpha('#1e293b', 0.9) : alpha('#ffffff', 0.9),
                        }),
                    }),
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        marginBottom: 4,
                        '&.Mui-focused': {
                            color: theme.palette.primary.main,
                        },
                    }),
                },
            },
            MuiList: {
                styleOverrides: {
                    root: {
                        padding: '8px',
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        borderRadius: style === 'flat' ? 0 : config.borderRadius,
                        margin: '2px 0',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                        '&.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.16),
                            },
                        },
                    }),
                },
            },
            MuiAutocomplete: {
                styleOverrides: {
                    paper: ({ theme }: any) => ({
                        marginTop: 8,
                        borderRadius: style === 'flat' ? 0 : 12,
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 12px 32px rgba(0,0,0,0.5)'
                            : '0 12px 32px rgba(0,0,0,0.1)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        backgroundImage: 'none',
                        ...(style === 'glass' && {
                            backdropFilter: 'blur(16px)',
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        }),
                    }),
                },
            },
            MuiDatePicker: {
                defaultProps: {
                    slotProps: {
                        textField: {
                            variant: 'outlined' as any,
                            size: config.compactMode ? 'small' : 'medium' as any
                        }
                    }
                }
            },
            MuiDateTimePicker: {
                defaultProps: {
                    slotProps: {
                        textField: {
                            variant: 'outlined' as any,
                            size: config.compactMode ? 'small' : 'medium' as any
                        }
                    }
                }
            },
            MuiDateField: {
                defaultProps: {
                    size: config.compactMode ? 'small' : 'medium' as any
                },
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        '& .MuiOutlinedInput-root': getInputStyles(theme),
                    }),
                },
            },
            MuiPickersTextField: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        '& .MuiOutlinedInput-root': getInputStyles(theme),
                    }),
                },
            },
            MuiPickersPopper: {
                styleOverrides: {
                    paper: ({ theme }: any) => ({
                        borderRadius: style === 'flat' ? 0 : Math.max(12, config.borderRadius * 2),
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 12px 32px rgba(0,0,0,0.4)'
                            : '0 12px 32px rgba(0,0,0,0.1)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        backgroundImage: 'none',
                        ...(style === 'glass' && {
                            backdropFilter: 'blur(16px)',
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        }),
                    }),
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: ({ theme }: any) => getPaperStyles(theme),
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: ({ theme }: any) => getPaperStyles(theme),
                    elevation1: ({ theme }: any) => ({
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                            : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }),
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        backgroundColor: theme.palette.mode === 'dark'
                            ? ((style === 'glass' || style === 'frosted') ? alpha(theme.palette.background.default, style === 'frosted' ? 0.85 : 0.7) : theme.palette.background.paper)
                            : '#ffffff',
                        backdropFilter: (style === 'glass' || style === 'frosted') ? (style === 'frosted' ? 'blur(32px)' : 'blur(16px)') : 'none',
                        color: theme.palette.text.primary,
                        boxShadow: 'none',
                        borderRadius: 0,
                        borderBottom: style === 'flat'
                            ? `2px solid ${theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.divider}`
                            : `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                    }),
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: ({ theme }: any) => ({
                        backgroundColor: theme.palette.mode === 'dark'
                            ? ((style === 'glass' || style === 'frosted') ? alpha(theme.palette.background.default, style === 'frosted' ? 0.95 : 0.85) : theme.palette.background.default)
                            : '#ffffff',
                        borderRight: style === 'flat'
                            ? `2px solid ${theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.divider}`
                            : `1px solid ${theme.palette.divider}`,
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: 0,
                        ...((style === 'glass' || style === 'frosted') && theme.palette.mode === 'dark' && {
                            backdropFilter: style === 'frosted' ? 'blur(40px)' : 'blur(24px)',
                        }),
                    }),
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: ({ theme }: any) => ({
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        padding: config.compactMode ? "8px 16px" : "16px",
                    }),
                    root: config.compactMode ? {
                        padding: "4px 16px",
                        height: 40,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 300,
                    } : {
                        fontWeight: 'inherit',
                        padding: "12px 16px",
                        height: 56,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 400,
                    },
                },
            },
            MuiTableSortLabel: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        color: `${theme.palette.primary.contrastText} !important`,
                        '&:hover': {
                            color: theme.palette.primary.contrastText,
                        },
                        '&.Mui-active': {
                            color: theme.palette.primary.contrastText,
                            '& .MuiTableSortLabel-icon': {
                                color: `${theme.palette.primary.contrastText} !important`,
                            },
                        },
                    }),
                    icon: ({ theme }: any) => ({
                        color: `${theme.palette.primary.contrastText} !important`,
                    }),
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: ({ theme }: any) => ({
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 700,
                        padding: '16px 24px',
                    }),
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: ({ theme }: any) => ({
                        ...getPaperStyles(theme),
                        borderRadius: style === 'flat' ? 0 : Math.max(16, config.borderRadius * 2),
                    }),
                },
            },
            MuiChip: {},
            MuiTooltip: {
                defaultProps: {
                    arrow: true,
                },
                styleOverrides: {
                    tooltip: {
                        backgroundColor: '#222',
                    },
                    arrow: {
                        color: '#222',
                    },
                },
            },
        } as any,
    };
};
