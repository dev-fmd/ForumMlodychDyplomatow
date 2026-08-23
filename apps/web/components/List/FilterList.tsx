"use client";
import type { Locale } from "next-intl";
import { useTranslations } from "next-intl";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState, useQueryStates } from "nuqs";
import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { X, List, ChevronLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import type { PaginationQueryFunction, PaginationResult } from "../../sanity/queries/pagination";
import Typography from "../ui/typography";
import { FilterListInput } from "./FilterListInput";
import FilterListPagination from "./FilterListPagination";
import FilterListTabs from "./FilterListTabs";
import { FilterListContext, TransitionContainer } from "./FilterListTransition";

import { FilterListGroupItem, FilterCheckboxItem } from "./FilterListItem";
import { Button } from "../ui/button";

// --- GŁÓWNE TYPY DLA FILTER LIST ---

export type FilterParams<
  T extends Record<string, string | number | string[]> = Record<string, string | number | string[]>,
> = {
  q?: string;
  filters?: T;
  locale: Locale;
};

type TabsType = { slug: string; values: { label: string; value: string; default?: boolean }[] };

type Props<
  T,
  TParams extends Record<string, string | number | string[]> = Record<
    string,
    string | number | string[]
  >,
> = {
  filters: Filter[];
  tabs?: TabsType;
  Component: React.ComponentType<{ item: T; locale: Locale }>;
  queryAction: PaginationQueryFunction<T, FilterParams<TParams>>;
  locale: Locale;
  perPage?: number;
  listClassName?: string;
  type?: string;
};

type FilterOption = {
  label: string;
  value: string;
  default?: undefined;
  subgroups?: undefined;
};

type FilterDefaultOption = {
  label: string;
  value?: undefined;
  default: true;
  subgroups?: undefined;
};

type FilterSubgroupOption = {
  label: string;
  value?: undefined;
  default?: undefined;
  subgroups: {
    label: string;
    value: string;
  }[];
};

export type Filter = {
  slug: string;
  label?: string;
  defaultValue?: string;
  multiple?: boolean;
  maxSelection?: number;
  options: Array<FilterOption | FilterDefaultOption | FilterSubgroupOption>;
};

type FilterResultType = typeof parseAsString | ReturnType<typeof parseAsArrayOf<string>>;

const createFilterListParams = (filters: Filter[], tabs?: TabsType) => {
  return {
    q: parseAsString,
    sort: parseAsString.withDefault("desc"),
    ...(Object.fromEntries(
      filters.map((filter) => {
        const singleParser = filter.defaultValue
          ? parseAsString.withDefault(filter.defaultValue)
          : parseAsString;
        if (filter.multiple) {
          return [filter.slug, parseAsArrayOf(singleParser)];
        }
        return [filter.slug, singleParser];
      })
    ) as Record<string, FilterResultType>),
    ...(tabs
      ? {
          [tabs.slug]: parseAsString.withDefault(
            tabs.values.find((tab) => tab.default)?.value ?? tabs.values[0].value
          ),
        }
      : {}),
  };
};

const pageParam = parseAsInteger.withDefault(1);

// --- FUNKCJE POMOCNICZE (WYCIĄGNIĘTE POZA KOMPONENT) ---

const computeActiveFilters = (
  filters: Filter[],
  params: Record<string, string | string[] | number | null>
) => {
  const active: { label: string; value: string; slug: string }[] = [];

  filters.forEach((filter) => {
    const val = params[filter.slug];
    if (!val) return; // Pomijamy iterację, jeśli filtr nie ma przypisanych parametrów w URL

    const activeValues = new Set(Array.isArray(val) ? val : [val]);

    filter.options.forEach((opt) => {
      if (opt.subgroups) {
        opt.subgroups.forEach((sub) => {
          if (sub.value && activeValues.has(sub.value)) {
            active.push({ value: sub.value, label: sub.label, slug: filter.slug });
          }
        });
      } else if (opt.value && activeValues.has(opt.value)) {
        active.push({ value: opt.value, label: opt.label, slug: filter.slug });
      }
    });
  });

  return active;
};

// --- GŁÓWNY KOMPONENT ---

export const FilterList = <
  T extends { _id: string },
  TParams extends Record<string, string | number | string[]>,
>({
  filters,
  tabs,
  queryAction,
  Component,
  locale,
  perPage = 10,
  listClassName,
  type = "event",
}: Props<T, TParams>) => {
  const t = useTranslations("filterComponent");
  const [isPending, startTransition] = useTransition();
  const scrollToTopRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const paramsParser = useMemo(
    () => createFilterListParams(filters, tabs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(filters), JSON.stringify(tabs)]
  );

  const [params, setParams] = useQueryStates(paramsParser);
  const [page, setPage] = useQueryState(
    "page",
    pageParam.withOptions({
      scroll: true,
    })
  );
  const [data, setData] = useState<PaginationResult<T> | null>(null);

  // Zoptymalizowane wyliczenie aktywnych filtrów w jednym przejściu
  const activeFilters = useMemo(() => computeActiveFilters(filters, params), [filters, params]);

  const getActiveCountForGroup = (slug: string, subgroups: { label: string; value: string }[]) => {
    const current = params[slug as keyof typeof params];
    if (!current) return 0;
    if (Array.isArray(current)) {
      return current.filter((v) => subgroups.some((sub) => sub.value === v)).length;
    }
    return subgroups.some((sub) => sub.value === current) ? 1 : 0;
  };

  const handleRemoveFilter = (slug: string, value: string) => {
    const currentVal = params[slug as keyof typeof params];
    if (Array.isArray(currentVal)) {
      setParams({ [slug]: currentVal.filter((v) => v !== value) } as Partial<typeof params>);
    } else {
      setParams({ [slug]: null } as Partial<typeof params>);
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    const resetObj: Record<string, string | number | null> = { q: null };
    filters.forEach((f) => {
      resetObj[f.slug] = null;
    });
    setParams(resetObj as Partial<typeof params>);
    setPage(1);
  };

  useEffect(() => {
    startTransition(async () => {
      const result = await queryAction({
        page: page ?? 1,
        perPage,
        q: params.q ?? undefined,
        filters: {
          ...(filters.reduce(
            (acc, filter) => {
              const value = params[filter.slug as keyof typeof params] ?? undefined;
              if (value) {
                acc[filter.slug] = value as string | string[] | number;
              }
              return acc;
            },
            {} as Record<string, number | string | string[]>
          ) as TParams),
          ...(tabs ? { [tabs.slug]: params[tabs.slug as keyof typeof params] } : {}),
          sort: params.sort,
        },
        locale,
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), page, locale, perPage]);

  const renderFiltersList = () => (
    <>
      {/* SPECJALNY NAGŁÓWEK DLA TYPU EXPERTS */}
      {type === "experts" && (
        <div className="mb-4 w-full border-b-2 border-brand-red-800 p-2 text-brand-red">
          <Typography variant="body-s">{t("category")}</Typography>
        </div>
      )}

      {filters.map((filter) => {
        const currentSelection = params[filter.slug as keyof typeof params];
        const isMaxReached =
          filter.maxSelection !== undefined &&
          Array.isArray(currentSelection) &&
          currentSelection.length >= filter.maxSelection;

        return (
          <div key={filter.slug} className="flex w-full flex-col items-start">
            {/* Etykieta grupy filtrów (ukrywana dla experts, by nie duplikować z nagłówkiem "Filtry") */}
            {filter.label && type !== "publications" && type !== "experts" && (
              <Typography variant="body-m" className="mb-2 font-semibold">
                {filter.label}
              </Typography>
            )}

            {/* INFORMACJA O MAKSYMALNEJ LICZBIE OPCJI */}
            {filter.maxSelection !== undefined && (
              <Typography variant="body-m" className="mb-4 text-brand-gray-400">
                {t("maxAmmount") + " " + filter.maxSelection}
              </Typography>
            )}

            <div className="flex w-full flex-col">
              {filter.options.map((option) => {
                if (option.subgroups) {
                  return (
                    <FilterListGroupItem
                      key={option.label}
                      label={option.label}
                      slug={filter.slug}
                      subgroups={option.subgroups}
                      type={type}
                      activeCount={getActiveCountForGroup(filter.slug, option.subgroups)}
                      maxSelection={filter.maxSelection}
                    />
                  );
                }

                // Wolnostojący wariant
                const isChecked = Array.isArray(currentSelection)
                  ? currentSelection.includes(option.value ?? "")
                  : currentSelection === option.value;

                const isDisabled = isMaxReached && !isChecked;

                return (
                  <div key={option.value ?? "default"} className="w-full py-1">
                    <FilterCheckboxItem
                      label={option.label}
                      slug={filter.slug}
                      value={option.value ?? ""}
                      isDisabled={isDisabled}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen]);

  return (
    <FilterListContext.Provider value={{ isPending, startTransition }}>
      <div ref={scrollToTopRef} />
      {/* --- MOBILE DRAWER OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 flex flex-col bg-white desktop:hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-200 p-4">
            <Button
              variant="none"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full p-1 text-brand-red-900 hover:bg-gray-50"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <div className="flex-1">
              <FilterListInput
                placeholder={type == "publications" ? t("publicationsSearch") : t("search")}
              />
            </div>
          </div>

          {/* Ciało z filtrami i opcjami */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Aktywne filtry mobilnie */}
            {(activeFilters.length > 0 || params.q) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {activeFilters.map((f, i) => (
                  <Button
                    variant="none"
                    size="inline"
                    key={`mobile-${f.slug}-${f.value}-${i}`}
                    onClick={() => handleRemoveFilter(f.slug, f.value)}
                    className="flex items-center gap-1 rounded-full border border-brand-slate-200 bg-brand-slate-50 px-2.5 text-brand-gray-900 transition-colors hover:text-brand-red-700"
                  >
                    <Typography variant="body-s">{f.label}</Typography>
                    <X className="size-3" />
                  </Button>
                ))}
                <Button
                  variant="none"
                  size="inline"
                  onClick={handleResetFilters}
                  className="ml-2 rounded-full font-semibold text-brand-red-900 hover:text-brand-red-700"
                >
                  <Typography variant="body-m">{t("reset")}</Typography>
                </Button>
              </div>
            )}

            {/* Renderowanie filtrów dla widoku mobilnego */}
            {renderFiltersList()}
          </div>
        </div>
      )}

      {/* --- GŁÓWNY WIDOK KOMPONENTU --- */}
      <div className="relative flex w-full flex-col gap-10 desktop:flex-row">
        {/* LEWA KOLUMNA (DESKTOP) */}
        <div className="hidden w-64 shrink-0 flex-col items-start desktop:flex">
          {renderFiltersList()}
        </div>

        {/* PRAWA KOLUMNA */}
        <div className="flex grow flex-col gap-4">
          {/* PASEK WYSZUKIWANIA I TRIGGER MOBILNY */}
          <div className="flex flex-col gap-4">
            <div className="flex w-full flex-row items-center gap-4">
              <FilterListInput
                placeholder={type == "publications" ? t("publicationsSearch") : t("search")}
              />
            </div>

            {/* Trigger "KATEGORIE" widoczny tylko na mobile */}
            <div className="flex items-center justify-center py-2 desktop:hidden">
              <Button
                variant="none"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center gap-2 font-semibold text-brand-blue-900"
              >
                <List className="size-5" />
                {t("category")}
                {activeFilters.length > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-brand-red-900 text-xs font-bold text-white">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* BELKA Z FILTRAMI */}
          <div className="hidden flex-col items-start justify-between gap-4 border-b border-gray-100 py-2 pb-4 text-sm text-gray-500 md:flex-row md:items-center desktop:flex">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                {t("results")}: {data?.total ?? 0}
              </span>

              {activeFilters.map((f, i) => (
                <Button
                  variant="none"
                  size="inline"
                  key={`${f.slug}-${f.value}-${i}`}
                  onClick={() => handleRemoveFilter(f.slug, f.value)}
                  className="flex items-center gap-1 rounded-full border border-brand-slate-200 bg-brand-slate-50 px-2.5 text-brand-gray-900 transition-colors hover:text-brand-red-700"
                >
                  <Typography variant="body-s">{f.label}</Typography>
                  <X className="size-3" />
                </Button>
              ))}

              {(activeFilters.length > 0 || params.q) && (
                <Button
                  variant="none"
                  size="inline"
                  onClick={handleResetFilters}
                  className="ml-2 rounded-full font-semibold text-brand-red-900 hover:text-brand-red-700"
                >
                  <Typography variant="body-m">{t("reset")}</Typography>
                </Button>
              )}
            </div>

            {type === "publications" && (
              <div className="flex items-center gap-2">
                <span>{t("sortBy")}:</span>
                <select
                  className="cursor-pointer bg-transparent font-semibold text-gray-900 outline-none"
                  value={params.sort as string}
                  onChange={(e) => {
                    setParams({ sort: e.target.value });
                    setPage(1);
                  }}
                >
                  <option value="desc">{t("sortNewest")}</option>
                  <option value="asc">{t("sortOldest")}</option>
                </select>
              </div>
            )}
          </div>

          {/* DLA INNYCH TYPÓW (STARY WIDOK NA DESKTOPIE) */}
          {type !== "publications" && (
            <Typography>
              {t("results")}: {data?.total ?? 0}
            </Typography>
          )}

          {tabs && <FilterListTabs slug={tabs.slug} tabs={tabs.values} />}

          <TransitionContainer
            pendingClassName="opacity-70"
            className={cn("transition-opacity duration-150", listClassName)}
          >
            {data === null ? (
              <Typography>{t("loading")}</Typography>
            ) : data.items.length === 0 && type === "publications" ? (
              <div className="col-span-2 mt-4 flex w-full flex-col items-start justify-between rounded-lg border border-brand-slate-100 bg-white p-8 md:flex-row lg:items-center">
                <div className="mb-4 md:mb-0">
                  <Typography variant="body-m" className="font-bold text-gray-900">
                    {t("emptyStatePublicationsTitle")}
                  </Typography>
                  <Typography variant="body-m" className="mt-1 text-gray-500">
                    {t("emptyStatePublicationsDesc")}
                  </Typography>
                </div>
                <Button
                  onClick={handleResetFilters}
                  variant="secondary"
                  className="border-brand-blue text-brand-blue"
                >
                  {t("showAllPublications")}
                </Button>
              </div>
            ) : (
              data.items.map((item, index) => <Component key={index} item={item} locale={locale} />)
            )}
          </TransitionContainer>
          <FilterListPagination perPage={perPage} total={data?.total ?? 0} />
        </div>
      </div>
    </FilterListContext.Provider>
  );
};
