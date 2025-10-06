type ThemeBaseColors = {
  [K in Theme]: { [X in BaseColors]: string };
};

type ThemeColors = {
  [K in Theme]: { [X in ColorKeys]: string };
};

export type Theme = 'General' | 'Neon_Style' | 'Neon_2_0';

type BaseColors =
  | 'Basic_Primary_primary_50'
  | 'Basic_Primary_primary_100'
  | 'Basic_Primary_primary_200'
  | 'Basic_Primary_primary_300'
  | 'Basic_Primary_primary_400'
  | 'Basic_Primary_primary_500'
  | 'Basic_Primary_primary_600'
  | 'Basic_Primary_primary_700'
  | 'Basic_Primary_primary_800'
  | 'Basic_Primary_primary_900'
  | 'Basic_Dark_dark_50'
  | 'Basic_Dark_dark_100'
  | 'Basic_Dark_dark_200'
  | 'Basic_Dark_dark_300'
  | 'Basic_Dark_dark_400'
  | 'Basic_Dark_dark_500'
  | 'Basic_Dark_dark_600'
  | 'Basic_Dark_dark_700'
  | 'Basic_Dark_dark_800'
  | 'Basic_Dark_dark_900'
  | 'Basic_Secondary_secondary_50'
  | 'Basic_Secondary_secondary_100'
  | 'Basic_Secondary_secondary_200'
  | 'Basic_Secondary_secondary_300'
  | 'Basic_Secondary_secondary_400'
  | 'Basic_Secondary_secondary_500'
  | 'Basic_Secondary_secondary_600'
  | 'Basic_Secondary_secondary_700'
  | 'Basic_Secondary_secondary_800'
  | 'Basic_Secondary_secondary_900'
  | 'Basic_Info_info_50'
  | 'Basic_Info_info_100'
  | 'Basic_Info_info_200'
  | 'Basic_Info_info_300'
  | 'Basic_Info_info_400'
  | 'Basic_Info_info_500'
  | 'Basic_Info_info_600'
  | 'Basic_Info_info_700'
  | 'Basic_Info_info_800'
  | 'Basic_Info_info_900'
  | 'Basic_Danger_danger_50'
  | 'Basic_Danger_danger_100'
  | 'Basic_Danger_danger_200'
  | 'Basic_Danger_danger_300'
  | 'Basic_Danger_danger_400'
  | 'Basic_Danger_danger_500'
  | 'Basic_Danger_danger_600'
  | 'Basic_Danger_danger_700'
  | 'Basic_Danger_danger_800'
  | 'Basic_Danger_danger_900'
  | 'Basic_Warning_warning_50'
  | 'Basic_Warning_warning_100'
  | 'Basic_Warning_warning_200'
  | 'Basic_Warning_warning_300'
  | 'Basic_Warning_warning_400'
  | 'Basic_Warning_warning_500'
  | 'Basic_Warning_warning_600'
  | 'Basic_Warning_warning_700'
  | 'Basic_Warning_warning_800'
  | 'Basic_Warning_warning_900'
  | 'Basic_Success_success_50'
  | 'Basic_Success_success_100'
  | 'Basic_Success_success_200'
  | 'Basic_Success_success_300'
  | 'Basic_Success_success_400'
  | 'Basic_Success_success_500'
  | 'Basic_Success_success_600'
  | 'Basic_Success_success_700'
  | 'Basic_Success_success_800'
  | 'Basic_Success_success_900'
  | 'Basic_Light_light_50'
  | 'Basic_Light_light_100'
  | 'Basic_Light_light_200'
  | 'Basic_Light_light_300'
  | 'Basic_Light_light_400'
  | 'Basic_Light_light_500'
  | 'Basic_Light_light_600'
  | 'Basic_Light_light_700'
  | 'Basic_Light_light_800'
  | 'Basic_Light_light_900'
  | 'Basic_Neutral_Neutral_25'
  | 'Basic_Neutral_Neutral_100'
  | 'Basic_Neutral_Neutral_200'
  | 'Basic_Neutral_Neutral_300'
  | 'Basic_Neutral_Neutral_400'
  | 'Basic_Neutral_Neutral_150'
  | 'Basic_Neutral_Neutral_250'
  | 'Basic_Neutral_Neutral_350'
  | 'Basic_Neutral_Neutral_450'
  | 'Basic_Neutral_Neutral_500'
  | 'Basic_Neutral_Neutral_600'
  | 'Basic_Neutral_Neutral_550'
  | 'Basic_Neutral_Neutral_700'
  | 'Basic_Neutral_Neutral_800'
  | 'Basic_Neutral_Neutral_900'
  | 'Basic_Neutral_Neutral_50';

type ColorKeys =
  | BaseColors
  | 'Semantic_Button_button_primary_bg'
  | 'Semantic_Button_button_secondary_bg'
  | 'Semantic_Button_button_success_bg'
  | 'Semantic_Button_button_warning_bg'
  | 'Semantic_Button_button_danger_bg'
  | 'Semantic_Button_button_info_bg'
  | 'Semantic_Button_button_general_text'
  | 'Semantic_Button_button_other_text'
  | 'Semantic_Button_button_primary_hover'
  | 'Semantic_Button_button_secondary_hover'
  | 'Semantic_Button_button_success_hover'
  | 'Semantic_Button_button_warning_hover'
  | 'Semantic_Button_button_danger_hover'
  | 'Semantic_Button_button_disable_text'
  | 'Semantic_Button_button_disable_bg'
  | 'Semantic_Text_text_primary'
  | 'Semantic_Text_text_secondary'
  | 'Semantic_Text_text_success'
  | 'Semantic_Text_text_warning'
  | 'Semantic_Text_text_danger'
  | 'Semantic_Text_text_info'
  | 'Semantic_Text_text_disable_text'
  | 'Semantic_Text_text_heading_50'
  | 'Semantic_Text_text_body_50'
  | 'Semantic_Text_text_label'
  | 'Semantic_Text_text_placeholder'
  | 'Semantic_Text_text_body_100'
  | 'Semantic_Text_text_body_900'
  | 'Semantic_Text_text_body_800'
  | 'Semantic_Text_text_heading_900'
  | 'Semantic_Text_text_heading_100'
  | 'Semantic_Text_text_body_200'
  | 'Semantic_Border_border_primary'
  | 'Semantic_Border_border_secondary'
  | 'Semantic_Border_border_success'
  | 'Semantic_Border_border_warning'
  | 'Semantic_Border_border_danger'
  | 'Semantic_Border_border_info'
  | 'Semantic_Border_border_disable'
  | 'Semantic_Border_border_standard_100'
  | 'Semantic_Border_border_standard_50'
  | 'Semantic_Border_border_input'
  | 'Semantic_Border_border_standard_900'
  | 'Semantic_Icon_icon_primary'
  | 'Semantic_Icon_icon_attribute'
  | 'Semantic_Icon_icon_secondary'
  | 'Semantic_Icon_icon_black'
  | 'Semantic_Icon_icon_white'
  | 'Semantic_Icon_icon_disable'
  | 'Semantic_Icon_icon_nonactive'
  | 'Semantic_Other_checkbox_normal_border'
  | 'Semantic_Other_checkbox_disable_fill'
  | 'Semantic_Other_checkbox_disable_checked_fill'
  | 'Semantic_Other_checkbox_disable_checked_check'
  | 'Semantic_Other_checkbox_checked_fill'
  | 'Semantic_Other_checkbox_checked_check'
  | 'Semantic_Other_radio_normal_border'
  | 'Semantic_Other_radio_disable_border'
  | 'Semantic_Other_radio_disable_fill'
  | 'Semantic_Other_radio_checked_fill'
  | 'Semantic_Other_radio_checked_border'
  | 'Semantic_Other_switch_disable_fill'
  | 'Semantic_Other_switch_checked_fill'
  | 'Semantic_Other_checkbox_disable_border'
  | 'Semantic_General_general_fill_light'
  | 'Semantic_General_general_fill_light_2'
  | 'Semantic_General_general_fill_primary_2'
  | 'Semantic_General_general_fill_disable'
  | 'Semantic_General_general_fill_primary_1'
  | 'Semantic_General_general_fill_black_1'
  | 'Semantic_General_general_fill_black_2'
  | 'Semantic_General_general_fill_black_3'
  | 'Semantic_General_general_fill_black_4'
  | 'Semantic_Background_bg_black'
  | 'Semantic_Background_bg_black_2'
  | 'Semantic_Background_bg_primary'
  | 'Semantic_Background_bg_danger'
  | 'Semantic_Background_bg_warning'
  | 'Semantic_Background_bg_success'
  | 'Semantic_Background_bg_info'
  | 'Semantic_Background_bg_black_3'
  | 'Semantic_Background_bg_black_4'
  | 'Semantic_Background_bg_success_light'
  | 'Semantic_Background_bg_info_light'
  | 'Semantic_Background_bg_primary_light'
  | 'Semantic_Background_bg_danger_light'
  | 'Semantic_Background_bg_warning_light'
  | 'Semantic_Background_bg_secondary'
  | 'Semantic_Background_bg_soft'
  | 'Semantic_Background_bg_supersoft'
  | 'Semantic_Background_bg_disable'
  | 'Semantic_Text_text_body_100'
  | 'Black_10'
  | 'Black_30'
  | 'Semantic_SC_General_body_1'
  | 'Semantic_Text_body_light';
const ThemeBaseColors: ThemeBaseColors = {
  General: {
    Basic_Primary_primary_50: '#d5e9d8',
    Basic_Primary_primary_100: '#b9dabe',
    Basic_Primary_primary_200: '#96c79e',
    Basic_Primary_primary_300: '#73b57e',
    Basic_Primary_primary_400: '#50a25d',
    Basic_Primary_primary_500: '#2d903d',
    Basic_Primary_primary_600: '#267833',
    Basic_Primary_primary_700: '#1e6029',
    Basic_Primary_primary_800: '#17481f',
    Basic_Primary_primary_900: '#0f3014',
    Basic_Dark_dark_50: '#e1e0e0',
    Basic_Dark_dark_100: '#d8d5d5',
    Basic_Dark_dark_200: '#c7c6c6',
    Basic_Dark_dark_300: '#b6b5b5',
    Basic_Dark_dark_400: '#9d9c9c',
    Basic_Dark_dark_500: '#7e7e7e',
    Basic_Dark_dark_600: '#545454',
    Basic_Dark_dark_700: '#333333',
    Basic_Dark_dark_800: '#212121',
    Basic_Dark_dark_900: '#111111',
    Basic_Secondary_secondary_50: '#fbf4f2',
    Basic_Secondary_secondary_100: '#f7e8e4',
    Basic_Secondary_secondary_200: '#efcec6',
    Basic_Secondary_secondary_300: '#e7b1a2',
    Basic_Secondary_secondary_400: '#df8e73',
    Basic_Secondary_secondary_500: '#d65e0e',
    Basic_Secondary_secondary_600: '#bf540d',
    Basic_Secondary_secondary_700: '#a6490b',
    Basic_Secondary_secondary_800: '#873b09',
    Basic_Secondary_secondary_900: '#602a06',
    Basic_Info_info_50: '#ecf4ff',
    Basic_Info_info_100: '#dbeafe',
    Basic_Info_info_200: '#bfdbfe',
    Basic_Info_info_300: '#93c5fd',
    Basic_Info_info_400: '#60a5fa',
    Basic_Info_info_500: '#3b82f6',
    Basic_Info_info_600: '#2563eb',
    Basic_Info_info_700: '#1d4ed8',
    Basic_Info_info_800: '#1e40af',
    Basic_Info_info_900: '#1e3a8a',
    Basic_Danger_danger_50: '#ffeeee',
    Basic_Danger_danger_100: '#fee2e2',
    Basic_Danger_danger_200: '#fecaca',
    Basic_Danger_danger_300: '#fca5a5',
    Basic_Danger_danger_400: '#f87171',
    Basic_Danger_danger_500: '#ef4444',
    Basic_Danger_danger_600: '#dc2626',
    Basic_Danger_danger_700: '#b91c1c',
    Basic_Danger_danger_800: '#991b1b',
    Basic_Danger_danger_900: '#7f1d1d',
    Basic_Warning_warning_50: '#fff9e0',
    Basic_Warning_warning_100: '#fef3c7',
    Basic_Warning_warning_200: '#fde68a',
    Basic_Warning_warning_300: '#fcd34d',
    Basic_Warning_warning_400: '#fbbf24',
    Basic_Warning_warning_500: '#f59e0b',
    Basic_Warning_warning_600: '#d97706',
    Basic_Warning_warning_700: '#b45309',
    Basic_Warning_warning_800: '#92400e',
    Basic_Warning_warning_900: '#78350f',
    Basic_Success_success_50: '#e9fff4',
    Basic_Success_success_100: '#d1fae5',
    Basic_Success_success_200: '#a7f3d0',
    Basic_Success_success_300: '#6ee7b7',
    Basic_Success_success_400: '#34d399',
    Basic_Success_success_500: '#10b981',
    Basic_Success_success_600: '#059669',
    Basic_Success_success_700: '#047857',
    Basic_Success_success_800: '#065f46',
    Basic_Success_success_900: '#024230',
    Basic_Light_light_50: '#fcfcfd',
    Basic_Light_light_100: '#f6f6f6',
    Basic_Light_light_200: '#eff0f1',
    Basic_Light_light_300: '#eaebed',
    Basic_Light_light_400: '#e5e6e8',
    Basic_Light_light_500: '#e0e1e4',
    Basic_Light_light_600: '#bbbbbe',
    Basic_Light_light_700: '#959698',
    Basic_Light_light_800: '#707172',
    Basic_Light_light_900: '#636364',
    Basic_Neutral_Neutral_25: '#e7e7eb',
    Basic_Neutral_Neutral_100: '#d1d0d2',
    Basic_Neutral_Neutral_200: '#b6b5b9',
    Basic_Neutral_Neutral_300: '#84808a',
    Basic_Neutral_Neutral_400: '#4b4257',
    Basic_Neutral_Neutral_150: '#cbcacd',
    Basic_Neutral_Neutral_250: '#a09da4',
    Basic_Neutral_Neutral_350: '#625b6b',
    Basic_Neutral_Neutral_450: '#433b4e',
    Basic_Neutral_Neutral_500: '#3d3647',
    Basic_Neutral_Neutral_600: '#2f2a37',
    Basic_Neutral_Neutral_550: '#352f3e',
    Basic_Neutral_Neutral_700: '#27222d',
    Basic_Neutral_Neutral_800: '#1f1b24',
    Basic_Neutral_Neutral_900: '#18151c',
    Basic_Neutral_Neutral_50: '#e7e7eb',
  },
  Neon_Style: {
    Basic_Primary_primary_50: '#f7efff',
    Basic_Primary_primary_100: '#e5ccfd',
    Basic_Primary_primary_200: '#d8b4fd',
    Basic_Primary_primary_300: '#c792fc',
    Basic_Primary_primary_400: '#bc7dfb',
    Basic_Primary_primary_500: '#ab5cfa',
    Basic_Primary_primary_600: '#9c54e4',
    Basic_Primary_primary_700: '#7941b2',
    Basic_Primary_primary_800: '#5e338a',
    Basic_Primary_primary_900: '#482769',
    Basic_Dark_dark_50: '#ebebeb',
    Basic_Dark_dark_100: '#bfbec0',
    Basic_Dark_dark_200: '#a09ea2',
    Basic_Dark_dark_300: '#747278',
    Basic_Dark_dark_400: '#59565d',
    Basic_Dark_dark_500: '#302c35',
    Basic_Dark_dark_600: '#2c2830',
    Basic_Dark_dark_700: '#221f26',
    Basic_Dark_dark_800: '#1a181d',
    Basic_Dark_dark_900: '#141216',
    Basic_Secondary_secondary_50: '#fdf1e7',
    Basic_Secondary_secondary_100: '#f9d4b5',
    Basic_Secondary_secondary_200: '#f6bf91',
    Basic_Secondary_secondary_300: '#f2a25f',
    Basic_Secondary_secondary_400: '#f09040',
    Basic_Secondary_secondary_500: '#ec8710',
    Basic_Secondary_secondary_600: '#d76a0f',
    Basic_Secondary_secondary_700: '#a8520b',
    Basic_Secondary_secondary_800: '#824009',
    Basic_Secondary_secondary_900: '#633107',
    Basic_Info_info_50: '#ffefef',
    Basic_Info_info_100: '#ffcecf',
    Basic_Info_info_200: '#ffb7b7',
    Basic_Info_info_300: '#fe9696',
    Basic_Info_info_400: '#fe8182',
    Basic_Info_info_500: '#fe6263',
    Basic_Info_info_600: '#e7595a',
    Basic_Info_info_700: '#b44646',
    Basic_Info_info_800: '#8c3636',
    Basic_Info_info_900: '#6b292a',
    Basic_Danger_danger_50: '#ffe6ef',
    Basic_Danger_danger_100: '#ffc3c8',
    Basic_Danger_danger_200: '#ffa7ae',
    Basic_Danger_danger_300: '#ff7e89',
    Basic_Danger_danger_400: '#ff6572',
    Basic_Danger_danger_500: '#ff3f4f',
    Basic_Danger_danger_600: '#e83948',
    Basic_Danger_danger_700: '#b52d38',
    Basic_Danger_danger_800: '#8c232b',
    Basic_Danger_danger_900: '#6b1a21',
    Basic_Warning_warning_50: '#fffde7',
    Basic_Warning_warning_100: '#fff9b5',
    Basic_Warning_warning_200: '#fff692',
    Basic_Warning_warning_300: '#fff260',
    Basic_Warning_warning_400: '#ffef41',
    Basic_Warning_warning_500: '#ffeb11',
    Basic_Warning_warning_600: '#e8d60f',
    Basic_Warning_warning_700: '#b5a70c',
    Basic_Warning_warning_800: '#8c8109',
    Basic_Warning_warning_900: '#6b6307',
    Basic_Success_success_50: '#e6f8f1',
    Basic_Success_success_100: '#b2e9d3',
    Basic_Success_success_200: '#8cdfbe',
    Basic_Success_success_300: '#58d0a0',
    Basic_Success_success_400: '#38c78d',
    Basic_Success_success_500: '#06b971',
    Basic_Success_success_600: '#05a867',
    Basic_Success_success_700: '#048350',
    Basic_Success_success_800: '#03663e',
    Basic_Success_success_900: '#034e2f',
    Basic_Light_light_50: '#fdfdfd',
    Basic_Light_light_100: '#f6f6f6',
    Basic_Light_light_200: '#f4f4f4',
    Basic_Light_light_300: '#eeeeee',
    Basic_Light_light_400: '#ebebeb',
    Basic_Light_light_500: '#e6e6e6',
    Basic_Light_light_600: '#d0d0d1',
    Basic_Light_light_700: '#a3a3a3',
    Basic_Light_light_800: '#7e7e7f',
    Basic_Light_light_900: '#606061',
    Basic_Neutral_Neutral_25: '#f5f5f5',
    Basic_Neutral_Neutral_100: '#d6d5d8',
    Basic_Neutral_Neutral_200: '#b6b5b9',
    Basic_Neutral_Neutral_300: '#84808a',
    Basic_Neutral_Neutral_400: '#4b4257',
    Basic_Neutral_Neutral_150: '#cbcacd',
    Basic_Neutral_Neutral_250: '#a09da4',
    Basic_Neutral_Neutral_350: '#625b6b',
    Basic_Neutral_Neutral_450: '#433b4e',
    Basic_Neutral_Neutral_500: '#3d3647',
    Basic_Neutral_Neutral_600: '#2f2a37',
    Basic_Neutral_Neutral_550: '#352f3e',
    Basic_Neutral_Neutral_700: '#27222d',
    Basic_Neutral_Neutral_800: '#1f1b24',
    Basic_Neutral_Neutral_900: '#18151c',
    Basic_Neutral_Neutral_50: '#efefef',
  },
  Neon_2_0: {
    Basic_Primary_primary_50: '#f1e8fe',
    Basic_Primary_primary_100: '#e1cefd',
    Basic_Primary_primary_200: '#d1b0fc',
    Basic_Primary_primary_300: '#bf8dfb',
    Basic_Primary_primary_400: '#ab5cfa',
    Basic_Primary_primary_500: '#9952E0',
    Basic_Primary_primary_600: '#8447c2',
    Basic_Primary_primary_700: '#6C3A9E',
    Basic_Primary_primary_800: '#4c2970',
    Basic_Primary_primary_900: '#361d4f',
    Basic_Dark_dark_50: '#efefef',
    Basic_Dark_dark_100: '#ddeedd',
    Basic_Dark_dark_200: '#cbcacd',
    Basic_Dark_dark_300: '#b6b5b9',
    Basic_Dark_dark_400: '#a09da4',
    Basic_Dark_dark_500: '#84808a',
    Basic_Dark_dark_600: '#625b6b',
    Basic_Dark_dark_700: '#4b4257',
    Basic_Dark_dark_800: '#1a181d',
    Basic_Dark_dark_900: '#141216',
    Basic_Secondary_secondary_50: '#fdf1e7',
    Basic_Secondary_secondary_100: '#f9d4b5',
    Basic_Secondary_secondary_200: '#f6bf91',
    Basic_Secondary_secondary_300: '#f2a25f',
    Basic_Secondary_secondary_400: '#f09040',
    Basic_Secondary_secondary_500: '#ec8710',
    Basic_Secondary_secondary_600: '#d76a0f',
    Basic_Secondary_secondary_700: '#a8520b',
    Basic_Secondary_secondary_800: '#824009',
    Basic_Secondary_secondary_900: '#633107',
    Basic_Info_info_50: '#ffefef',
    Basic_Info_info_100: '#ffcecf',
    Basic_Info_info_200: '#ffb7b7',
    Basic_Info_info_300: '#fe9696',
    Basic_Info_info_400: '#fe8182',
    Basic_Info_info_500: '#fe6263',
    Basic_Info_info_600: '#e7595a',
    Basic_Info_info_700: '#b44646',
    Basic_Info_info_800: '#8c3636',
    Basic_Info_info_900: '#6b292a',
    Basic_Danger_danger_50: '#ffe6ef',
    Basic_Danger_danger_100: '#ffc3c8',
    Basic_Danger_danger_200: '#ffa7ae',
    Basic_Danger_danger_300: '#ff7e89',
    Basic_Danger_danger_400: '#ff6572',
    Basic_Danger_danger_500: '#ff3f4f',
    Basic_Danger_danger_600: '#e83948',
    Basic_Danger_danger_700: '#b52d38',
    Basic_Danger_danger_800: '#8c232b',
    Basic_Danger_danger_900: '#6b1a21',
    Basic_Warning_warning_50: '#fffde7',
    Basic_Warning_warning_100: '#fff9b5',
    Basic_Warning_warning_200: '#fff692',
    Basic_Warning_warning_300: '#fff260',
    Basic_Warning_warning_400: '#ffef41',
    Basic_Warning_warning_500: '#ffeb11',
    Basic_Warning_warning_600: '#e8d60f',
    Basic_Warning_warning_700: '#b5a70c',
    Basic_Warning_warning_800: '#8c8109',
    Basic_Warning_warning_900: '#6b6307',
    Basic_Success_success_50: '#e6f8f1',
    Basic_Success_success_100: '#b2e9d3',
    Basic_Success_success_200: '#8cdfbe',
    Basic_Success_success_300: '#58d0a0',
    Basic_Success_success_400: '#38c78d',
    Basic_Success_success_500: '#06b971',
    Basic_Success_success_600: '#05a867',
    Basic_Success_success_700: '#048350',
    Basic_Success_success_800: '#03663e',
    Basic_Success_success_900: '#034e2f',
    Basic_Light_light_50: '#fdfdfd',
    Basic_Light_light_100: '#f6f6f6',
    Basic_Light_light_200: '#f4f4f4',
    Basic_Light_light_300: '#eeeeee',
    Basic_Light_light_400: '#ebebeb',
    Basic_Light_light_500: '#e6e6e6',
    Basic_Light_light_600: '#d0d0d1',
    Basic_Light_light_700: '#a3a3a3',
    Basic_Light_light_800: '#7e7e7f',
    Basic_Light_light_900: '#606061',
    Basic_Neutral_Neutral_25: '#f5f5f5',
    Basic_Neutral_Neutral_100: '#e0dfe1',
    Basic_Neutral_Neutral_200: '#b6b5b9',
    Basic_Neutral_Neutral_300: '#84808a',
    Basic_Neutral_Neutral_400: '#4b4257',
    Basic_Neutral_Neutral_150: '#cbcacd',
    Basic_Neutral_Neutral_250: '#a09da4',
    Basic_Neutral_Neutral_350: '#625b6b',
    Basic_Neutral_Neutral_450: '#433b4e',
    Basic_Neutral_Neutral_500: '#3d3647',
    Basic_Neutral_Neutral_600: '#2f2a37',
    Basic_Neutral_Neutral_550: '#352f3e',
    Basic_Neutral_Neutral_700: '#27222d',
    Basic_Neutral_Neutral_800: '#1f1b24',
    Basic_Neutral_Neutral_900: '#18151c',
    Basic_Neutral_Neutral_50: '#efefef',
  },
};

const Colors: ThemeColors = {
  General: {
    Semantic_Button_button_primary_bg:
      ThemeBaseColors.General.Basic_Primary_primary_500,
    Semantic_Button_button_secondary_bg:
      ThemeBaseColors.General.Basic_Secondary_secondary_500,
    Semantic_Button_button_success_bg:
      ThemeBaseColors.General.Basic_Success_success_500,
    Semantic_Button_button_warning_bg:
      ThemeBaseColors.General.Basic_Warning_warning_500,
    Semantic_Button_button_danger_bg:
      ThemeBaseColors.General.Basic_Danger_danger_500,
    Semantic_Button_button_info_bg: ThemeBaseColors.General.Basic_Info_info_500,
    Semantic_Button_button_general_text:
      ThemeBaseColors.General.Basic_Dark_dark_900,
    Semantic_Button_button_other_text:
      ThemeBaseColors.General.Basic_Secondary_secondary_500,
    Semantic_Button_button_primary_hover:
      ThemeBaseColors.General.Basic_Primary_primary_600,
    Semantic_Button_button_secondary_hover:
      ThemeBaseColors.General.Basic_Secondary_secondary_700,
    Semantic_Button_button_success_hover:
      ThemeBaseColors.General.Basic_Success_success_600,
    Semantic_Button_button_warning_hover:
      ThemeBaseColors.General.Basic_Warning_warning_600,
    Semantic_Button_button_danger_hover:
      ThemeBaseColors.General.Basic_Danger_danger_600,
    Semantic_Button_button_disable_text:
      ThemeBaseColors.General.Basic_Light_light_600,
    Semantic_Button_button_disable_bg:
      ThemeBaseColors.General.Basic_Light_light_400,
    Semantic_Text_text_primary:
      ThemeBaseColors.General.Basic_Primary_primary_500,
    Semantic_Text_text_secondary:
      ThemeBaseColors.General.Basic_Secondary_secondary_500,
    Semantic_Text_text_success:
      ThemeBaseColors.General.Basic_Success_success_500,
    Semantic_Text_text_warning:
      ThemeBaseColors.General.Basic_Warning_warning_500,
    Semantic_Text_text_danger: ThemeBaseColors.General.Basic_Danger_danger_500,
    Semantic_Text_text_info: ThemeBaseColors.General.Basic_Info_info_500,
    Semantic_Text_text_disable_text:
      ThemeBaseColors.General.Basic_Light_light_600,
    Semantic_Text_text_heading_50: ThemeBaseColors.General.Basic_Dark_dark_900,
    Semantic_Text_text_body_50: ThemeBaseColors.General.Basic_Dark_dark_900,
    Semantic_Text_text_label: ThemeBaseColors.General.Basic_Dark_dark_900,
    Semantic_Text_text_placeholder: ThemeBaseColors.General.Basic_Dark_dark_300,
    Semantic_Text_text_body_100: ThemeBaseColors.General.Basic_Dark_dark_700,
    Semantic_Text_text_body_900: ThemeBaseColors.General.Basic_Light_light_50,
    Semantic_Text_text_body_800: ThemeBaseColors.General.Basic_Light_light_600,
    Semantic_Text_text_heading_900:
      ThemeBaseColors.General.Basic_Light_light_50,
    Semantic_Text_text_heading_100: ThemeBaseColors.General.Basic_Dark_dark_700,
    Semantic_Text_text_body_200: ThemeBaseColors.General.Basic_Dark_dark_400,
    Semantic_Border_border_primary:
      ThemeBaseColors.General.Basic_Primary_primary_600,
    Semantic_Border_border_secondary:
      ThemeBaseColors.General.Basic_Secondary_secondary_600,
    Semantic_Border_border_success:
      ThemeBaseColors.General.Basic_Success_success_600,
    Semantic_Border_border_warning:
      ThemeBaseColors.General.Basic_Warning_warning_600,
    Semantic_Border_border_danger:
      ThemeBaseColors.General.Basic_Danger_danger_600,
    Semantic_Border_border_info: ThemeBaseColors.General.Basic_Info_info_600,
    Semantic_Border_border_disable:
      ThemeBaseColors.General.Basic_Light_light_700,
    Semantic_Border_border_standard_100:
      ThemeBaseColors.General.Basic_Light_light_500,
    Semantic_Border_border_standard_50:
      ThemeBaseColors.General.Basic_Light_light_700,
    Semantic_Border_border_input: ThemeBaseColors.General.Basic_Light_light_300,
    Semantic_Border_border_standard_900:
      ThemeBaseColors.General.Basic_Light_light_300,
    Semantic_Icon_icon_primary:
      ThemeBaseColors.General.Basic_Primary_primary_500,
    Semantic_Icon_icon_attribute: ThemeBaseColors.General.Basic_Dark_dark_300,
    Semantic_Icon_icon_secondary:
      ThemeBaseColors.General.Basic_Secondary_secondary_500,
    Semantic_Icon_icon_black: ThemeBaseColors.General.Basic_Dark_dark_900,
    Semantic_Icon_icon_white: ThemeBaseColors.General.Basic_Light_light_50,
    Semantic_Icon_icon_disable: ThemeBaseColors.General.Basic_Dark_dark_300,
    Semantic_Icon_icon_nonactive: ThemeBaseColors.General.Basic_Dark_dark_200,
    Semantic_Other_checkbox_normal_border:
      ThemeBaseColors.General.Basic_Dark_dark_100,
    Semantic_Other_checkbox_disable_fill:
      ThemeBaseColors.General.Basic_Light_light_400,
    Semantic_Other_checkbox_disable_checked_fill:
      ThemeBaseColors.General.Basic_Light_light_400,
    Semantic_Other_checkbox_disable_checked_check:
      ThemeBaseColors.General.Basic_Dark_dark_100,
    Semantic_Other_checkbox_checked_fill:
      ThemeBaseColors.General.Basic_Primary_primary_500,
    Semantic_Other_checkbox_checked_check:
      ThemeBaseColors.General.Basic_Light_light_50,
    Semantic_Other_radio_normal_border:
      ThemeBaseColors.General.Basic_Dark_dark_100,
    Semantic_Other_radio_disable_border:
      ThemeBaseColors.General.Basic_Dark_dark_100,
    Semantic_Other_radio_disable_fill:
      ThemeBaseColors.General.Basic_Dark_dark_100,
    Semantic_Other_radio_checked_fill:
      ThemeBaseColors.General.Basic_Primary_primary_500,
    Semantic_Other_radio_checked_border:
      ThemeBaseColors.General.Basic_Primary_primary_500,
    Semantic_Other_switch_disable_fill:
      ThemeBaseColors.General.Basic_Dark_dark_100,
    Semantic_Other_switch_checked_fill:
      ThemeBaseColors.General.Basic_Primary_primary_500,
    Semantic_Other_checkbox_disable_border:
      ThemeBaseColors.General.Basic_Dark_dark_100,
    Semantic_General_general_fill_light:
      ThemeBaseColors.General.Basic_Light_light_50,
    Semantic_General_general_fill_light_2:
      ThemeBaseColors.General.Basic_Light_light_100,
    Semantic_General_general_fill_primary_2:
      ThemeBaseColors.General.Basic_Primary_primary_500,
    Semantic_General_general_fill_disable:
      ThemeBaseColors.General.Basic_Dark_dark_100,
    Semantic_General_general_fill_primary_1:
      ThemeBaseColors.General.Basic_Primary_primary_50,
    Semantic_General_general_fill_black_1:
      ThemeBaseColors.General.Basic_Dark_dark_900,
    Semantic_General_general_fill_black_2:
      ThemeBaseColors.General.Basic_Dark_dark_800,
    Semantic_General_general_fill_black_3:
      ThemeBaseColors.General.Basic_Dark_dark_700,
    Semantic_General_general_fill_black_4:
      ThemeBaseColors.General.Basic_Dark_dark_600,
    Semantic_Background_bg_black: ThemeBaseColors.General.Basic_Light_light_300,
    Semantic_Background_bg_black_2:
      ThemeBaseColors.General.Basic_Light_light_200,
    Semantic_Background_bg_primary:
      ThemeBaseColors.General.Basic_Primary_primary_600,
    Semantic_Background_bg_danger:
      ThemeBaseColors.General.Basic_Danger_danger_600,
    Semantic_Background_bg_warning:
      ThemeBaseColors.General.Basic_Warning_warning_600,
    Semantic_Background_bg_success:
      ThemeBaseColors.General.Basic_Success_success_600,
    Semantic_Background_bg_info: ThemeBaseColors.General.Basic_Info_info_600,
    Semantic_Background_bg_black_3:
      ThemeBaseColors.General.Basic_Light_light_100,
    Semantic_Background_bg_black_4:
      ThemeBaseColors.General.Basic_Light_light_50,
    Semantic_Background_bg_success_light:
      ThemeBaseColors.General.Basic_Success_success_50,
    Semantic_Background_bg_info_light:
      ThemeBaseColors.General.Basic_Info_info_50,
    Semantic_Background_bg_primary_light:
      ThemeBaseColors.General.Basic_Primary_primary_50,
    Semantic_Background_bg_danger_light:
      ThemeBaseColors.General.Basic_Danger_danger_50,
    Semantic_Background_bg_warning_light:
      ThemeBaseColors.General.Basic_Warning_warning_50,
    Semantic_Background_bg_secondary:
      ThemeBaseColors.General.Basic_Secondary_secondary_500,
    Semantic_Background_bg_soft: '#ffffff',
    Semantic_Background_bg_supersoft: '#1F1B24',
    Semantic_Background_bg_disable:
      ThemeBaseColors.General.Basic_Light_light_500,
    Black_10: '#E0E0E1',
    Black_30: '#B3B4B5',
    Semantic_SC_General_body_1: '#D1D1D1',
    Semantic_Text_body_light: '#F8F9F9',
    ...ThemeBaseColors.General,
  },
  Neon_Style: {
    Semantic_Button_button_primary_bg:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_500,
    Semantic_Button_button_secondary_bg:
      ThemeBaseColors.Neon_Style.Basic_Secondary_secondary_500,
    Semantic_Button_button_success_bg:
      ThemeBaseColors.Neon_Style.Basic_Success_success_500,
    Semantic_Button_button_warning_bg:
      ThemeBaseColors.Neon_Style.Basic_Warning_warning_500,
    Semantic_Button_button_danger_bg:
      ThemeBaseColors.Neon_Style.Basic_Danger_danger_500,
    Semantic_Button_button_info_bg:
      ThemeBaseColors.Neon_Style.Basic_Info_info_500,
    Semantic_Button_button_general_text:
      ThemeBaseColors.Neon_Style.Basic_Light_light_50,
    Semantic_Button_button_other_text:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_900,
    Semantic_Button_button_primary_hover:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_600,
    Semantic_Button_button_secondary_hover:
      ThemeBaseColors.Neon_Style.Basic_Secondary_secondary_600,
    Semantic_Button_button_success_hover:
      ThemeBaseColors.Neon_Style.Basic_Success_success_600,
    Semantic_Button_button_warning_hover:
      ThemeBaseColors.Neon_Style.Basic_Warning_warning_600,
    Semantic_Button_button_danger_hover:
      ThemeBaseColors.Neon_Style.Basic_Danger_danger_600,
    Semantic_Button_button_disable_text:
      ThemeBaseColors.Neon_Style.Basic_Light_light_600,
    Semantic_Button_button_disable_bg:
      ThemeBaseColors.Neon_Style.Basic_Light_light_400,
    Semantic_Text_text_primary:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_500,
    Semantic_Text_text_secondary:
      ThemeBaseColors.Neon_Style.Basic_Secondary_secondary_500,
    Semantic_Text_text_success:
      ThemeBaseColors.Neon_Style.Basic_Success_success_500,
    Semantic_Text_text_warning:
      ThemeBaseColors.Neon_Style.Basic_Warning_warning_500,
    Semantic_Text_text_danger:
      ThemeBaseColors.Neon_Style.Basic_Danger_danger_500,
    Semantic_Text_text_info: ThemeBaseColors.Neon_Style.Basic_Info_info_500,
    Semantic_Text_text_disable_text:
      ThemeBaseColors.Neon_Style.Basic_Light_light_600,
    Semantic_Text_text_heading_50:
      ThemeBaseColors.Neon_Style.Basic_Light_light_50,
    Semantic_Text_text_body_50:
      ThemeBaseColors.Neon_Style.Basic_Light_light_100,
    Semantic_Text_text_label: ThemeBaseColors.Neon_Style.Basic_Light_light_50,
    Semantic_Text_text_placeholder:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_400,
    Semantic_Text_text_body_100:
      ThemeBaseColors.Neon_Style.Basic_Light_light_400,
    Semantic_Text_text_body_900: ThemeBaseColors.Neon_Style.Basic_Dark_dark_800,
    Semantic_Text_text_body_800: ThemeBaseColors.Neon_Style.Basic_Dark_dark_500,
    Semantic_Text_text_heading_900:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_800,
    Semantic_Text_text_heading_100:
      ThemeBaseColors.Neon_Style.Basic_Light_light_600,
    Semantic_Text_text_body_200:
      ThemeBaseColors.Neon_Style.Basic_Light_light_600,
    Semantic_Border_border_primary:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_600,
    Semantic_Border_border_secondary:
      ThemeBaseColors.Neon_Style.Basic_Secondary_secondary_600,
    Semantic_Border_border_success:
      ThemeBaseColors.Neon_Style.Basic_Success_success_600,
    Semantic_Border_border_warning:
      ThemeBaseColors.Neon_Style.Basic_Warning_warning_600,
    Semantic_Border_border_danger:
      ThemeBaseColors.Neon_Style.Basic_Danger_danger_600,
    Semantic_Border_border_info: ThemeBaseColors.Neon_Style.Basic_Info_info_600,
    Semantic_Border_border_disable:
      ThemeBaseColors.Neon_Style.Basic_Light_light_700,
    Semantic_Border_border_standard_100:
      ThemeBaseColors.Neon_Style.Basic_Neutral_Neutral_450,
    Semantic_Border_border_standard_50:
      ThemeBaseColors.Neon_Style.Basic_Neutral_Neutral_400,
    Semantic_Border_border_input:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_700,
    Semantic_Border_border_standard_900:
      ThemeBaseColors.Neon_Style.Basic_Neutral_Neutral_300,
    Semantic_Icon_icon_primary:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_500,
    Semantic_Icon_icon_attribute:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_300,
    Semantic_Icon_icon_secondary:
      ThemeBaseColors.Neon_Style.Basic_Secondary_secondary_500,
    Semantic_Icon_icon_black: ThemeBaseColors.Neon_Style.Basic_Dark_dark_900,
    Semantic_Icon_icon_white: ThemeBaseColors.Neon_Style.Basic_Light_light_50,
    Semantic_Icon_icon_disable: ThemeBaseColors.Neon_Style.Basic_Dark_dark_900,
    Semantic_Icon_icon_nonactive:
      ThemeBaseColors.Neon_Style.Basic_Neutral_Neutral_300,
    Semantic_Other_checkbox_normal_border:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_100,
    Semantic_Other_checkbox_disable_fill:
      ThemeBaseColors.Neon_Style.Basic_Light_light_400,
    Semantic_Other_checkbox_disable_checked_fill:
      ThemeBaseColors.Neon_Style.Basic_Light_light_400,
    Semantic_Other_checkbox_disable_checked_check:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_100,
    Semantic_Other_checkbox_checked_fill:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_500,
    Semantic_Other_checkbox_checked_check:
      ThemeBaseColors.Neon_Style.Basic_Light_light_50,
    Semantic_Other_radio_normal_border:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_100,
    Semantic_Other_radio_disable_border:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_100,
    Semantic_Other_radio_disable_fill:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_100,
    Semantic_Other_radio_checked_fill:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_500,
    Semantic_Other_radio_checked_border:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_500,
    Semantic_Other_switch_disable_fill:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_100,
    Semantic_Other_switch_checked_fill:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_500,
    Semantic_Other_checkbox_disable_border:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_100,
    Semantic_General_general_fill_light:
      ThemeBaseColors.Neon_Style.Basic_Light_light_50,
    Semantic_General_general_fill_light_2:
      ThemeBaseColors.Neon_Style.Basic_Light_light_100,
    Semantic_General_general_fill_primary_2:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_500,
    Semantic_General_general_fill_disable:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_100,
    Semantic_General_general_fill_primary_1:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_50,
    Semantic_General_general_fill_black_1:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_900,
    Semantic_General_general_fill_black_2:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_800,
    Semantic_General_general_fill_black_3:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_700,
    Semantic_General_general_fill_black_4:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_600,
    Semantic_Background_bg_black:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_900,
    Semantic_Background_bg_black_2:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_800,
    Semantic_Background_bg_primary:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_600,
    Semantic_Background_bg_danger:
      ThemeBaseColors.Neon_Style.Basic_Danger_danger_600,
    Semantic_Background_bg_warning:
      ThemeBaseColors.Neon_Style.Basic_Warning_warning_600,
    Semantic_Background_bg_success:
      ThemeBaseColors.Neon_Style.Basic_Success_success_600,
    Semantic_Background_bg_info: ThemeBaseColors.Neon_Style.Basic_Info_info_600,
    Semantic_Background_bg_black_3:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_700,
    Semantic_Background_bg_black_4:
      ThemeBaseColors.Neon_Style.Basic_Dark_dark_600,
    Semantic_Background_bg_success_light:
      ThemeBaseColors.Neon_Style.Basic_Success_success_50,
    Semantic_Background_bg_info_light:
      ThemeBaseColors.Neon_Style.Basic_Info_info_50,
    Semantic_Background_bg_primary_light:
      ThemeBaseColors.Neon_Style.Basic_Primary_primary_50,
    Semantic_Background_bg_danger_light:
      ThemeBaseColors.Neon_Style.Basic_Danger_danger_50,
    Semantic_Background_bg_warning_light:
      ThemeBaseColors.Neon_Style.Basic_Warning_warning_50,
    Semantic_Background_bg_secondary:
      ThemeBaseColors.Neon_Style.Basic_Secondary_secondary_600,
    Semantic_Background_bg_soft: '#ffffff',
    Semantic_Background_bg_supersoft: '#1F1B24',
    Semantic_Background_bg_disable:
      ThemeBaseColors.Neon_Style.Basic_Neutral_Neutral_350,
    Black_10: '#E0E0E1',
    Black_30: '#B3B4B5',
    Semantic_SC_General_body_1: '#D1D1D1',
    Semantic_Text_body_light: '#F8F9F9',
    ...ThemeBaseColors.Neon_Style,
  },
  Neon_2_0: {
    Semantic_Button_button_primary_bg:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_500,
    Semantic_Button_button_secondary_bg:
      ThemeBaseColors.Neon_2_0.Basic_Secondary_secondary_500,
    Semantic_Button_button_success_bg:
      ThemeBaseColors.Neon_2_0.Basic_Success_success_500,
    Semantic_Button_button_warning_bg:
      ThemeBaseColors.Neon_2_0.Basic_Warning_warning_500,
    Semantic_Button_button_danger_bg:
      ThemeBaseColors.Neon_2_0.Basic_Danger_danger_500,
    Semantic_Button_button_info_bg:
      ThemeBaseColors.Neon_2_0.Basic_Info_info_500,
    Semantic_Button_button_general_text:
      ThemeBaseColors.Neon_2_0.Basic_Light_light_50,
    Semantic_Button_button_other_text:
      ThemeBaseColors.Neon_2_0.Basic_Dark_dark_900,
    Semantic_Button_button_primary_hover:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_600,
    Semantic_Button_button_secondary_hover:
      ThemeBaseColors.Neon_2_0.Basic_Secondary_secondary_600,
    Semantic_Button_button_success_hover:
      ThemeBaseColors.Neon_2_0.Basic_Success_success_600,
    Semantic_Button_button_warning_hover:
      ThemeBaseColors.Neon_2_0.Basic_Warning_warning_600,
    Semantic_Button_button_danger_hover:
      ThemeBaseColors.Neon_2_0.Basic_Danger_danger_600,
    Semantic_Button_button_disable_text:
      ThemeBaseColors.Neon_2_0.Basic_Light_light_600,
    Semantic_Button_button_disable_bg:
      ThemeBaseColors.Neon_2_0.Basic_Light_light_400,
    Semantic_Text_text_primary:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_500,
    Semantic_Text_text_secondary:
      ThemeBaseColors.Neon_2_0.Basic_Secondary_secondary_500,
    Semantic_Text_text_success:
      ThemeBaseColors.Neon_2_0.Basic_Success_success_500,
    Semantic_Text_text_warning:
      ThemeBaseColors.Neon_2_0.Basic_Warning_warning_500,
    Semantic_Text_text_danger: ThemeBaseColors.Neon_2_0.Basic_Danger_danger_500,
    Semantic_Text_text_info: ThemeBaseColors.Neon_2_0.Basic_Info_info_500,
    Semantic_Text_text_disable_text:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_300,
    Semantic_Text_text_heading_50:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_25,
    Semantic_Text_text_body_50:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_50,
    Semantic_Text_text_label: ThemeBaseColors.Neon_2_0.Basic_Light_light_50,
    Semantic_Text_text_placeholder:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_300,
    Semantic_Text_text_body_100:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_150,
    Semantic_Text_text_body_900: '#FCFCFD', // ThemeBaseColors.Neon_2_0.Basic_Dark_dark_800,
    Semantic_Text_text_body_800: ThemeBaseColors.Neon_2_0.Basic_Dark_dark_500,
    Semantic_Text_text_heading_900:
      ThemeBaseColors.Neon_2_0.Basic_Dark_dark_800,
    Semantic_Text_text_heading_100:
      ThemeBaseColors.Neon_2_0.Basic_Light_light_600,
    Semantic_Text_text_body_200:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_200,
    Semantic_Border_border_primary:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_600,
    Semantic_Border_border_secondary:
      ThemeBaseColors.Neon_2_0.Basic_Secondary_secondary_600,
    Semantic_Border_border_success:
      ThemeBaseColors.Neon_2_0.Basic_Success_success_600,
    Semantic_Border_border_warning:
      ThemeBaseColors.Neon_2_0.Basic_Warning_warning_600,
    Semantic_Border_border_danger:
      ThemeBaseColors.Neon_2_0.Basic_Danger_danger_600,
    Semantic_Border_border_info: ThemeBaseColors.Neon_2_0.Basic_Info_info_600,
    Semantic_Border_border_disable:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_600,
    Semantic_Border_border_standard_100:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_450,
    Semantic_Border_border_standard_50:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_Border_border_input: ThemeBaseColors.Neon_2_0.Basic_Dark_dark_700,
    Semantic_Border_border_standard_900:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_300,
    Semantic_Icon_icon_primary:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_500,
    Semantic_Icon_icon_attribute:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_Icon_icon_secondary:
      ThemeBaseColors.Neon_2_0.Basic_Secondary_secondary_500,
    Semantic_Icon_icon_black:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_800,
    Semantic_Icon_icon_white: ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_25,
    Semantic_Icon_icon_disable:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_300,
    Semantic_Icon_icon_nonactive:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_300,
    Semantic_Other_checkbox_normal_border:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_Other_checkbox_disable_fill:
      ThemeBaseColors.Neon_2_0.Basic_Light_light_400,
    Semantic_Other_checkbox_disable_checked_fill:
      ThemeBaseColors.Neon_2_0.Basic_Light_light_400,
    Semantic_Other_checkbox_disable_checked_check:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_Other_checkbox_checked_fill:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_500,
    Semantic_Other_checkbox_checked_check:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_25,
    Semantic_Other_radio_normal_border:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_Other_radio_disable_border:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_Other_radio_disable_fill:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_Other_radio_checked_fill:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_500,
    Semantic_Other_radio_checked_border:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_500,
    Semantic_Other_switch_disable_fill:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_Other_switch_checked_fill:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_500,
    Semantic_Other_checkbox_disable_border:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_400,
    Semantic_General_general_fill_light:
      ThemeBaseColors.Neon_2_0.Basic_Light_light_50,
    Semantic_General_general_fill_light_2:
      ThemeBaseColors.Neon_2_0.Basic_Light_light_100,
    Semantic_General_general_fill_primary_2:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_500,
    Semantic_General_general_fill_disable:
      ThemeBaseColors.Neon_2_0.Basic_Dark_dark_100,
    Semantic_General_general_fill_primary_1:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_50,
    Semantic_General_general_fill_black_1:
      ThemeBaseColors.Neon_2_0.Basic_Dark_dark_900,
    Semantic_General_general_fill_black_2:
      ThemeBaseColors.Neon_2_0.Basic_Dark_dark_800,
    Semantic_General_general_fill_black_3:
      ThemeBaseColors.Neon_2_0.Basic_Dark_dark_700,
    Semantic_General_general_fill_black_4:
      ThemeBaseColors.Neon_2_0.Basic_Dark_dark_600,
    Semantic_Background_bg_black:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_900,
    Semantic_Background_bg_black_2:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_700,
    Semantic_Background_bg_primary:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_600,
    Semantic_Background_bg_danger:
      ThemeBaseColors.Neon_2_0.Basic_Danger_danger_600,
    Semantic_Background_bg_warning:
      ThemeBaseColors.Neon_2_0.Basic_Warning_warning_600,
    Semantic_Background_bg_success:
      ThemeBaseColors.Neon_2_0.Basic_Success_success_600,
    Semantic_Background_bg_info: ThemeBaseColors.Neon_2_0.Basic_Info_info_600,
    Semantic_Background_bg_black_3:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_600,
    Semantic_Background_bg_black_4:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_450,
    Semantic_Background_bg_success_light:
      ThemeBaseColors.Neon_2_0.Basic_Success_success_50,
    Semantic_Background_bg_info_light:
      ThemeBaseColors.Neon_2_0.Basic_Info_info_50,
    Semantic_Background_bg_primary_light:
      ThemeBaseColors.Neon_2_0.Basic_Primary_primary_50,
    Semantic_Background_bg_danger_light:
      ThemeBaseColors.Neon_2_0.Basic_Danger_danger_50,
    Semantic_Background_bg_warning_light:
      ThemeBaseColors.Neon_2_0.Basic_Warning_warning_50,
    Semantic_Background_bg_secondary:
      ThemeBaseColors.Neon_2_0.Basic_Secondary_secondary_600,
    Semantic_Background_bg_soft:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_25,
    Semantic_Background_bg_supersoft: '#1F1B24',
    Semantic_Background_bg_disable:
      ThemeBaseColors.Neon_2_0.Basic_Neutral_Neutral_350,
    Black_10: '#E0E0E1',
    Black_30: '#B3B4B5',
    Semantic_SC_General_body_1: '#D1D1D1',
    Semantic_Text_body_light: '#F8F9F9',
    ...ThemeBaseColors.Neon_2_0,
  },
};

export default Colors;

export type ColorsType = {
  [key in ColorKeys]: string;
};
