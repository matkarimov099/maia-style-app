# 🎯 CODING PATTERNS - CARGO CUSTOMS PROJECT

Bu faylda loyiha bo'ylab qo'llaniladigan barcha coding patternlar va best practicelar to'liq keltirilgan.

---

## 📚 Mundarija

1. [Papka Strukturasi](#1-papka-strukturasi)
2. [I18n Pattern (Feature-Based)](#2-i18n-pattern-feature-based)
3. [Service Layer Pattern](#3-service-layer-pattern)
4. [React Query Hooks Pattern](#4-react-query-hooks-pattern)
5. [Validation Pattern (Zod + I18n)](#5-validation-pattern-zod--i18n)
6. [Component Pattern](#6-component-pattern)
7. [State Management (Zustand)](#7-state-management-zustand)
8. [Type Definitions](#8-type-definitions)
9. [Naming Conventions](#9-naming-conventions)

---

## 1. PAPKA STRUKTURASI

### Feature-Based Structure ✅

```
src/features/
└── [feature-name]/              # Misol: new-menu/transit-at
    ├── components/              # UI components
    │   ├── [FeatureName]Table.tsx
    │   ├── [FeatureName]Filter.tsx
    │   ├── [FeatureName]Form.tsx
    │   └── row-actions.tsx
    ├── hooks/
    │   └── use-[feature]-queries.ts
    ├── services/
    │   └── [feature].service.ts
    ├── schemas/
    │   ├── [feature].schema.ts
    │   ├── index.ts
    │   └── README.md
    ├── types/
    │   └── index.ts
    ├── utils/                   # (optional)
    │   ├── helpers.ts
    │   └── constants.ts
    └── index.ts                 # Public exports
```

### Global I18n Structure ✅

```
src/utils/locales/
├── uz/
│   ├── common.json              # Umumiy so'zlar
│   ├── features/
│   │   ├── transit-at.json     # Feature-specific
│   │   └── export-ek.json
│   └── index.ts                 # Auto-merge
├── ru/
```

### Real Example: Products feature structure:

```
src/features/products/
├── components/
│   ├── products-table.tsx
│   ├── products-filter.tsx
│   ├── row-actions.tsx
│   ├── Columns.tsx
│   ├── actions/
│   │   ├── ProductCreate.tsx
│   │   ├── ProductView.tsx
│   │   └── ProductEdit.tsx
│   │   └── ProductDelete.tsx
├── hooks/
│   └── use-products.ts           # React Query hooks
├── services/
│   └── products.service.ts
├── validations/
│   ├── products.schemas.ts
│   ├── index.ts
├── types/
│   └── index.ts
└── index.ts
```

---

## 2. I18N PATTERN (FEATURE-BASED)

### Structure

```
src/utils/locales/
├── uz/
│   ├── common.json              # Umumiy translationlar
│   ├── features/
│   │   └── transit-at.json     # Feature translationlar
│   └── index.ts                 # Auto-merge qiladi
├── ru/
### Common Translations

```
// src/utils/locales/uz/common.json
{
  "common": {
    "save": "Saqlash",
    "cancel": "Bekor qilish",
    "delete": "O'chirish",
    "edit": "Tahrirlash",
    "all": "Barchasi",
    "refresh": "Yangilash"
  }
}
```

### Feature Translations

```
// src/utils/locales/uz/features/transit-at.json
{
  "transit": {
    "title": "Tranzit (AT)",
    "filter": {
      "region": "Hudud",
      "dateFrom": "Dan",
      "dateTo": "Gacha"
    },
    "table": {
      "declarationNumber": "Deklaratsiya raqami",
      "status": "Holat"
    },
    "validation": {
      "required": "Bu maydon to'ldirilishi shart",
      "minLength": "Kamida {min} ta belgi bo'lishi kerak"
    }
  }
}
```
## 3. SERVICE LAYER PATTERN

Service layer - **faqat API calls**. Boshqa logika yo'q!

### Axios Response Destructuring

Axios response quyidagi strukturaga ega:
```
{
  data: {...},        // Server javob ma'lumotlari ✅
  status: 200,        // HTTP status code
  statusText: 'OK',   // Status text
  headers: {...},     // Response headers
  config: {...},      // Request config
  request: {...}      // XMLHttpRequest object
}
```

**Bizga faqat `data` kerak!** Shuning uchun destructuring ishlatamiz:

```typescript
// ✅ To'g'ri - destructuring
const { data } = await axios.post<Response>('/api/endpoint', payload);
return data;

// ❌ Noto'g'ri - butun response
const response = await axios.post<Response>('/api/endpoint', payload);
return response.data;  // Qo'shimcha qator
```

### Template

```
// features/[feature-name]/services/[feature].service.ts
import axiosClient from '@/plugins/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/common';
import type {
  [Feature],
  [Feature]Create,
  [Feature]Filter,
  [Feature]Update
} from '../types';

// ============ ENDPOINTS ============
const [FEATURE]_ENDPOINTS = {
  CREATE: '/[feature]',
  UPDATE: '/[feature]',  // yoki (id: string) => `/[feature]/${id}`
  SEARCH: '/[feature]/search',
  DELETE: (id: string) => `/[feature]/${id}`,
} as const;

// ============ SERVICE ============
export const [feature]Service = {
  create: async (data: [Feature]Create): Promise<ApiResponse> => {
    const { data: response } = await axiosClient.post<ApiResponse>(
      [FEATURE]_ENDPOINTS.CREATE,
      data
    );
    return response;
  },

  update: async (id: string, data: [Feature]Update): Promise<ApiResponse> => {
    const { data: response } = await axiosClient.put<ApiResponse>(
      [FEATURE]_ENDPOINTS.UPDATE,
      { id, ...data }
    );
    return response;
  },

  getList: async (filter: [Feature]Filter): Promise<PaginatedResponse<[Feature]>> => {
    const { data } = await axiosClient.post<PaginatedResponse<[Feature]>>(
      [FEATURE]_ENDPOINTS.SEARCH,
      filter
    );
    return data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const { data } = await axiosClient.delete<ApiResponse>(
      [FEATURE]_ENDPOINTS.DELETE(id)
    );
    return data;
  },
};
```

### Real Example: Teams Service

```typescript
// features/teams/services/teams.service.ts
import axiosClient from '@/plugins/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/common';
import type { Team, TeamCreate, TeamFilter, TeamUpdate } from '../types';

// ============ ENDPOINTS ============
const TEAMS_ENDPOINTS = {
  CREATE: '/teams',
  UPDATE: '/teams',
  SEARCH: '/teams/search',
  DELETE: (id: string) => `/teams/${id}`,
} as const;

// ============ SERVICE ============
export const teamsService = {
  create: async (data: TeamCreate): Promise<ApiResponse> => {
    const { data: response } = await axiosClient.post<ApiResponse>(
      TEAMS_ENDPOINTS.CREATE,
      data
    );
    return response;
  },

  update: async (id: string, data: TeamUpdate): Promise<ApiResponse> => {
    const { data: response } = await axiosClient.put<ApiResponse>(
      TEAMS_ENDPOINTS.UPDATE,
      { id, ...data }
    );
    return response;
  },

  getList: async (filter: TeamFilter): Promise<PaginatedResponse<Team>> => {
    const { data } = await axiosClient.post<PaginatedResponse<Team>>(
      TEAMS_ENDPOINTS.SEARCH,
      filter
    );
    return data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const { data } = await axiosClient.delete<ApiResponse>(
      TEAMS_ENDPOINTS.DELETE(id)
    );
    return data;
  },
};
```

**Muhim:**

- ✅ Faqat API calls
- ✅ Endpoints alohida const sifatida
- ✅ Type annotations to'liq
- ✅ Error handling hook layerda
- ✅ Destructuring bilan data ni qaytarish
- ✅ Object-based service pattern

---

## 4. REACT QUERY HOOKS PATTERN

### Template

```
// features/[feature-name]/hooks/use-[feature]-queries.ts
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { [feature]Service } from '../services/[feature].service';
import type { [Feature]Filter, [Feature] } from '../types';

// ============ QUERY KEYS ============
export const [feature]Keys = {
  all: ['[feature]'] as const,
  lists: () => [...[feature]Keys.all, 'list'] as const,
  list: (filter: [Feature]Filter) => [...[feature]Keys.lists(), filter] as const,
  details: () => [...[feature]Keys.all, 'detail'] as const,
  detail: (id: string) => [...[feature]Keys.details(), id] as const
};

// ============ QUERIES ============
export function use[Feature]List(filter: [Feature]Filter) {
  const { data, isLoading, isFetching, error, isRefetching } = useQuery({
    queryKey: [feature]Keys.list(filter),
    queryFn: () => [feature]Service.getList(filter),
    enabled: !!filter
  });

  return useMemo(
    () => ({
      items: data?.items || [],
      total: data?.total || 0,
      isLoading,
      isFetching,
      error,
      isRefetching,
      isEmpty: !isLoading && !data?.items?.length
    }),
    [data, isLoading, isFetching, error, isRefetching]
  );
}

// ============ MUTATIONS ============
export function useCreate[Feature]() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: [feature]Service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [feature]Keys.lists() });
    }
  });
}

export function useUpdate[Feature]() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Update[Feature]Input }) =>
      [feature]Service.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [feature]Keys.lists() });
      queryClient.invalidateQueries({ queryKey: [feature]Keys.details() });
    }
  });
}

export function useDelete[Feature]() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => [feature]Service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [feature]Keys.lists() });
    }
  });
}
```

**Muhim:**

- ✅ Query keys markazlashtirilgan
- ✅ useMemo optimizatsiyasi (GET queries uchun)
- ✅ Mutation hooks sodda (options yo'q)
- ✅ Inline callbacks component layerda
- ✅ Type-safe
- ✅ isLoading, isFetching, isRefetching

### Loading States Farqi

#### `isLoading`
- ✅ **Birinchi marta** data yuklanayotganda `true`
- ✅ Cache bo'sh bo'lganda
- ❌ Refetch paytida `false`
- **Ishlatish:** Skeleton loader, initial loading

```
{isLoading && <Skeleton />}
{isLoading ? <Spinner /> : <Table data={items} />}
```

#### `isFetching`
- ✅ **Har qanday** fetch paytida `true`
- ✅ Birinchi yuklanish
- ✅ Refetch
- ✅ Background refetch
- **Ishlatish:** Loading indicator, progress bar

```
{isFetching && <LinearProgress />}
<Button disabled={isFetching}>Submit</Button>
```

#### `isRefetching`
- ❌ Birinchi yuklanishda `false`
- ✅ **Faqat refetch** paytida `true`
- ✅ Cache mavjud bo'lganda yangilanayotganda
- **Ishlatish:** Refresh button, background sync indicator

```
<IconButton disabled={isRefetching}>
  <Refresh />
</IconButton>
```

#### Qachon qaysi birini ishlatish:

| Holat | isLoading | isFetching | isRefetching |
|-------|-----------|------------|--------------|
| Birinchi yuklanish | ✅ true | ✅ true | ❌ false |
| Refetch (cache bor) | ❌ false | ✅ true | ✅ true |
| Data tayyor | ❌ false | ❌ false | ❌ false |

```typescript
// ✅ To'g'ri ishlatish
return useMemo(
  () => ({
    items: data?.items || [],
    total: data?.total || 0,
    isLoading,      // Skeleton loader uchun
    isFetching,     // Loading indicator uchun
    isRefetching,   // Refresh button uchun
    isEmpty: !isLoading && !data?.items?.length
  }),
  [data, isLoading, isFetching, error, isRefetching]
);
```

---

## 5. VALIDATION PATTERN (ZOD + I18N)

### Translation Messages

```
// src/utils/locales/uz/features/transit-at.json
{
  "transit": {
    "validation": {
      "required": "Bu maydon to'ldirilishi shart",
      "string": "Matn bo'lishi kerak",
      "number": "Raqam bo'lishi kerak",
      "integer": "Butun son bo'lishi kerak",
      "minLength": "Kamida {min} ta belgi bo'lishi kerak",
      "maxLength": "Maksimal {max} ta belgi bo'lishi kerak",
      "min": "Kamida {min} bo'lishi kerak",
      "max": "Maksimal {max} bo'lishi kerak",
      "positive": "Musbat son bo'lishi kerak",
      "driverName": {
        "required": "Haydovchi F.I.O kiritilishi shart",
        "minLength": "Haydovchi F.I.O kamida {min} ta belgidan iborat bo'lishi kerak"
      },
      "driverPassport": {
        "format": "Passport raqami AA1234567 formatida bo'lishi kerak"
      }
    }
  }
}
```

## 6. COMPONENT PATTERN

### Form Component

```
// features/[feature-name]/components/Create[Feature]Form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';
import { create[Feature]Schema } from '../validations';
import { useCreate[Feature] } from '../hooks/use-[feature]-queries';

interface Create[Feature]FormProps {
  onClose: () => void;
}

export function Create[Feature]Form({ onClose }: Create[Feature]FormProps) {
  const t = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(create[Feature]Schema(t))
  });

  const { mutate: create[Feature], isPending } = useCreate[Feature]();

  const onSubmit = (data) => {
    create[Feature](data, {
      onSuccess: () => {
        alert(t('common.success');
        reset();
        onClose();
      },
      onError: (error: any) => {
        alert(error?.message || t('common.error'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
       <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Title</FormLabel>
                    <FormControl>
                      <Input inputSize="md" placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
    </form>
  );
}
```


#### ✅ Inline Callbacks (Tavsiya qilinadi)

```typescript
const { mutate: createDeclaration, isPending } = useCreateAutoTransport();

const onSubmit = (data: CreateAutoTransportInput) => {
  createDeclaration(data, {
    onSuccess: () => {
      alert(intl.formatMessage({ id: 'common.success' }));
      reset();
      onClose();
    },
    onError: (error: any) => {
      alert(error?.message || intl.formatMessage({ id: 'common.error' }));
    }
  });
};
```

**Afzalliklari:**
- ✅ **Moslashuvchan** - Har bir action uchun turli xil callback
- ✅ **Aniq** - Logika qayerda ishlashi ko'rinadi
- ✅ **Dynamic** - Data ga kirish mumkin
- ✅ **Kengaytirish oson** - Yangi holatlar qo'shish oson

**Qachon ishlatish:**
- Har xil holatlar (draft, submit, approve)
- Conditional logika kerak bo'lganda
- Data ga bog'liq callback
- Multiple actions bir formada

```typescript
// Misol: Har xil holatlar
const onSubmit = (data: CreateAutoTransportInput) => {
  createDeclaration(data, {
    onSuccess: (response) => {
      console.log('Created:', response.id);
      navigate(`/detail/${response.id}`);
    }
  });
};

const onDraft = (data: CreateAutoTransportInput) => {
  createDeclaration({ ...data, status: 'draft' }, {
    onSuccess: () => {
      alert('Draft saved!');
      // Formni yopmaydi
    }
  });
};
```

**Afzalliklari:**
- ✅ **DRY** - Callback bir marta yoziladi
- ✅ **Simple** - onSubmit sodda

**Qachon ishlatish:**
- Har doim bir xil callback
- Simple forms
- Faqat bitta action


## 8. TYPE DEFINITIONS

```
// features/[feature-name]/types/index.ts

// ============ MAIN ENTITY ============
export interface [Feature] {
  id: string;
  field1: string;
  field2: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

// ============ FILTER ============
export interface [Feature]Filter {
  search?: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

## 9. NAMING CONVENTIONS

### 📝 File Naming Rules

#### ✅ PascalCase (React Components)
**Qoidalar:**
- React component fayllari **FAQAT** PascalCase
- Pages ham component, shuning uchun PascalCase
- Menu items ham component, PascalCase

**To'g'ri:**
```
✅ UserProfile.tsx
✅ LoginForm.tsx
✅ TransitAtTable.tsx
✅ CreateDeclarationForm.tsx
✅ TabGeneralInformation.tsx
✅ RowActions.tsx
✅ Columns.tsx
```

**Noto'g'ri:**
```
❌ user-profile.tsx
❌ login-form.tsx
❌ transit-at-table.tsx
❌ row-actions.tsx
❌ Columns.tsx
```

**Pages (har doim PascalCase):**
```
✅ src/pages/auth/Login.tsx
✅ src/pages/dashboard/Analytics.tsx
✅ src/pages/new-menu/TransitAt.tsx
✅ src/pages/tables/react-table/Basic.tsx

❌ src/pages/auth/login.tsx
❌ src/pages/dashboard/analytics.tsx
❌ src/pages/new-menu/transit-at.tsx
```

**Menu Items (har doim PascalCase):**
```
✅ src/modules/Dashboard.tsx
✅ src/modules/ExportImportTransit.tsx
✅ src/modules/NewMenu.tsx

❌ src/modules/dashboard.tsx
❌ src/modules/export-import-transit.tsx
```

---

#### ✅ camelCase (Utilities, Services, Schemas)

**Hooks (camelCase + .ts):**
```
✅ use-auth.ts
✅ use-transit-queries.ts
✅ use-auto-transport.ts

❌ UseAuth.ts
❌ use-Auth.ts
```

**Services (kebab-case.service.ts):**
```
✅ auth.service.ts
✅ transit.service.ts
✅ auto-transport.service.ts
✅ user-profile.service.ts

❌ Auth.service.ts
❌ authService.service.ts
❌ autoTransport.service.ts
```

**Schemas (kebab-case.schema(s).ts):**
```
✅ auth.schema.ts
✅ transit.schemas.ts
✅ auto-transport.schema.ts
✅ general-information-step.schema.ts
✅ user-profile.schema.ts

❌ Auth.schema.ts
❌ authSchema.schema.ts
❌ autoTransport.schema.ts
```

**Utilities (kebab-case.ts):**
```
✅ format-date.ts
✅ auth-utils.ts
✅ constants.ts
✅ helpers.ts

❌ FormatDate.ts
❌ formatDate.ts
❌ AuthUtils.ts
```

**Styled Components (kebab-case-styled.ts):**
```
✅ drawer-header-styled.ts
✅ mini-drawer-styled.ts
✅ button-styled.ts

❌ DrawerHeaderStyled.ts
❌ drawerHeaderStyled.ts
❌ MiniDrawerStyled.ts
```

**Theme Overrides (kebab-case.ts):**
```
✅ src/themes/overrides/button.ts
✅ src/themes/overrides/input-base.ts
✅ src/themes/overrides/table-cell.ts

❌ src/themes/overrides/Button.ts
❌ src/themes/overrides/inputBase.ts
❌ src/themes/overrides/InputBase.ts
```

---

#### ✅ kebab-case (Folders/Directories)

**Folders (har doim kebab-case):**
```
✅ user-management/
✅ auth-forms/
✅ detail-steps/
✅ export-import-transit/
✅ new-menu/

❌ userManagement/
❌ AuthForms/
❌ detailSteps/
```

---

### 🔤 Variable & Function Naming

```typescript
// ✅ camelCase (variables, functions)
const userName = 'John';
const isLoading = false;
const handleSubmit = () => {};
const fetchUserData = async () => {};

// ✅ PascalCase (components, types, interfaces)
interface TransitDeclaration {}
type UserRole = 'admin' | 'user';
function CreateDeclarationForm() {}
const MyComponent = () => {};

// ✅ UPPER_CASE (constants)
const API_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_PAGE_SIZE = 10;

// ✅ _prefixed (private variables - rare)
const _privateVar = 'internal';
```

---

### 🎣 React Query Naming

```typescript
// ✅ Query keys (camelCase)
export const transitKeys = {
  all: ['transit'] as const,
  lists: () => [...transitKeys.all, 'list'] as const,
  list: (filter: TransitFilter) => [...transitKeys.lists(), filter] as const
};

// ✅ Query hooks (camelCase, descriptive)
useTransitDeclarations();    // GET list
useTransitDeclaration(id);   // GET single
useCreateDeclaration();      // POST
useUpdateDeclaration();      // PUT
useDeleteDeclaration();      // DELETE
```

---

### 🔧 Service Naming

```typescript
// ✅ Service object (camelCase)
export const transitService = {
  getList: async () => {},
  getById: async () => {},
  create: async () => {},
  update: async () => {},
  delete: async () => {}
};

// ✅ File name: transit.service.ts (kebab-case.service.ts)
// ✅ Multi-word example: user-profile.service.ts, auto-transport.service.ts
```

---

### ✅ Validation Schema Naming

```typescript
// ✅ Schema functions (camelCase + descriptive)
export const createTransitSchema = (intl: IntlShape) => z.object({...});
export const updateTransitSchema = (intl: IntlShape) => z.object({...});
export const transitFilterSchema = (intl: IntlShape) => z.object({...});

// ✅ File name: transit.schemas.ts (kebab-case.schemas.ts)
// ✅ Multi-word example: user-profile.schemas.ts, auto-transport.schema.ts
```

---

---

### ⚠️ Common Mistakes

```typescript
// ❌ NOTO'G'RI
src/pages/auth/login.tsx              // page kebab-case emas
src/components/user-profile.tsx       // component kebab-case emas
src/modules/dashboard.tsx          // menu item kebab-case emas
src/services/Auth.service.ts          // service PascalCase emas
src/services/authService.service.ts   // service camelCase emas
src/hooks/UseAuth.ts                  // hook PascalCase emas
src/themes/overrides/Button.ts        // theme override PascalCase emas
src/themes/overrides/inputBase.ts     // theme override camelCase emas
src/folders/UserManagement/           // folder PascalCase emas
src/utils/formatDate.ts               // util camelCase emas

// ✅ TO'G'RI
src/pages/auth/Login.tsx              // page PascalCase
src/components/UserProfile.tsx        // component PascalCase
src/modules/Dashboard.tsx          // menu item PascalCase
src/services/auth.service.ts          // service kebab-case
src/services/user-profile.service.ts  // multi-word service kebab-case
src/hooks/use-auth.ts                 // hook kebab-case
src/themes/overrides/button.ts        // theme override kebab-case
src/themes/overrides/input-base.ts    // multi-word override kebab-case
src/folders/user-management/          // folder kebab-case
src/utils/format-date.ts              // util kebab-case
```

---

## ✅ BEST PRACTICES CHECKLIST

### I18n:

- [ ] Common translations `src/utils/locales/uz/common.json`
- [ ] Feature translations `src/utils/locales/uz/features/[feature].json`
- [ ] Trans / useTranslation ishlatilgan
- [ ] No hardcoded strings

### Service Layer:

- [ ] Faqat API calls
- [ ] To'liq type annotations
- [ ] Response.data ni qaytarish
- [ ] Error handling yo'q (hooks layerda)

### Hooks:

- [ ] Query keys markazlashtirilgan
- [ ] useMemo (GET queries uchun)
- [ ] Mutation hooks sodda (options yo'q)
- [ ] Type-safe
- [ ] isLoading, isFetching, isRefetching

### Validation:

- [ ] Translation messages `[feature].validation.*`
- [ ] Schema function `(intl) => z.object(...)`
- [ ] zodResolver ishlatilgan
- [ ] Type exports

### Components:

- [ ] Type annotations to'liq
- [ ] FormattedMessage / useIntl
- [ ] Error handling
- [ ] Loading states
- [ ] Inline callbacks (mutation uchun)

### General:

- [ ] Naming conventions to'g'ri
- [ ] Feature-based structure
- [ ] No hardcoded strings
- [ ] Type-safe
- [ ] Clean imports/exports

---

## 🚀 QUICK REFERENCE

### Yangi Feature Yaratish:

1. ✅ Papka strukturasini yaratish
2. ✅ Types yozish (`types/index.ts`)
3. ✅ Service yaratish (`services/[feature].service.ts`)
4. ✅ Hooks yaratish (`hooks/use-[feature]-queries.ts`)
5. ✅ Translation qo'shish (4 til: uz, ru, en, uz-cyrl)
6. ✅ Validation schemas (`validations/[feature]-schemas.ts`)
7. ✅ Components yaratish
8. ✅ Export (`index.ts`)

### Har Doim Esda Tuting:

- 🎯 Feature-based structure
- 🎯 Type-safe hamma joyda
- 🎯 FormattedMessage / useIntl
- 🎯 Service = faqat API
- 🎯 Hooks = React Query logic
- 🎯 Zustand = faqat UI state
- 🎯 Zod + t = validation
- 🎯 Clean, Simple, Professional

---
