export type Fm01SourceMode = 'auto' | 'api' | 'dummy'

export type Fm01TableSortOrder = 'asc' | 'desc'

export interface Fm01RouteContext {
  periodeModulId: string
  unitId: string
  aspekId: string
}

export interface Fm01ApiEnvelope<T> {
  success?: boolean
  message?: string
  data: T
}

export interface Fm01SidebarItem {
  id: string
  label: string
  to?: string
}

export interface Fm01SidebarProfile {
  name: string
  role: string
  avatar: string
}

export interface Fm01SidebarData {
  sectionTitle: string
  activeMenuId: string
  menus: Fm01SidebarItem[]
  profile: Fm01SidebarProfile
}

export interface Fm01SummaryMetric {
  id: string
  label: string
  value: string
}

export interface Fm01SummaryData {
  title: string
  description: string
  statusLabel: string
  statusValue: string
  statusDate: string
  metrics: Fm01SummaryMetric[]
}

export interface Fm01AspectOption {
  id: string
  label: string
}

export interface Fm01AspectObject {
  title: string
  typeLabel: string
  description: string
  addUnitLabel: string
  addUnitHint: string
}

export type Fm01AssessmentType = 'manual' | 'automatic' | 'none'

export interface Fm01AspectIndicator {
  id: string
  title: string
  description: string
  assessmentType: Fm01AssessmentType
}

export interface Fm01SupportingDocument {
  title: string
  subtitle: string
  submittedAt: string
  statusLabel: string
  statusValue: string
  deadlineLabel: string
  deadlineValue: string
  linkLabel: string
  link: string
  viewLabel: string
  senderNoteLabel: string
  senderNoteValue: string
}

export interface Fm01AspectDetail {
  title: string
  description: string
  objectLabel: string
  object: Fm01AspectObject
  indicatorLabel: string
  indicators: Fm01AspectIndicator[]
  document: Fm01SupportingDocument
}

export interface Fm01ScopeInfo {
  scopeLabel: string
  scopeValue: string
  scopeTag: string
  scopeDescription: string
  unitLabel: string
  unitValue: string
  unitDescription: string
}

export interface Fm01Stakeholder {
  id: string
  initials: string
  roleTag: string
  name: string
  email: string
}

export interface Fm01ValidationPanel {
  title: string
  status: string
  reviewerInitials: string
  reviewerName: string
  reviewerRole: string
  reviewedAt: string
  noteLabel: string
  notePlaceholder: string
}

export interface Fm01TableRow {
  id: string
  code: string
  name: string
  className: string
  lecturer: string
}

export interface Fm01TableData {
  title: string
  searchPlaceholder: string
  sortOptions: Array<{
    label: string
    value: Fm01TableSortOrder
  }>
  sortOrder: Fm01TableSortOrder
  pageSize: number
  actionLabel: string
  rows: Fm01TableRow[]
}

export interface Fm01IndicatorQualityOption {
  value: number
  title: string
  description: string
}

export interface Fm01IndicatorChecklistOption {
  id: string
  label: string
}

export interface Fm01IndicatorFormState {
  validationApproved: boolean
  contentQualityScore: number | null
  contentQualityJustification: string
  checklistFiles: string[]
  checklistNote: string
}

export interface Fm01IndicatorModalData {
  title: string
  subtitle: string
  closeLabel: string
  sectionOneTitle: string
  sectionOneDescription: string
  sectionOneTag: string
  sectionOneFetchedAt: string
  yesLabel: string
  noLabel: string
  sectionTwoTitle: string
  sectionTwoDescription: string
  sectionTwoTag: string
  qualityOptions: Fm01IndicatorQualityOption[]
  sectionTwoPlaceholder: string
  sectionThreeTitle: string
  sectionThreeDescription: string
  sectionThreeTag: string
  checklistOptions: Fm01IndicatorChecklistOption[]
  sectionThreePlaceholder: string
  cancelLabel: string
  submitLabel: string
  defaultForm: Fm01IndicatorFormState
}

export interface Fm01PageData {
  sidebar: Fm01SidebarData
  summary: Fm01SummaryData
  detailLabel: string
  detailTitle: string
  activeAspectId: string
  aspectOptions: Fm01AspectOption[]
  aspectDetails: Record<string, Fm01AspectDetail>
  scopeInfo: Fm01ScopeInfo
  stakeholderTitle: string
  stakeholderSubtitle: string
  stakeholders: Fm01Stakeholder[]
  validationPanel: Fm01ValidationPanel
  table: Fm01TableData
  indicatorModal: Fm01IndicatorModalData
}

export interface SaveFm01IndicatorPayload {
  objectId: string
  aspectId: string
  periodeModulId?: string
  unitId?: string
  form: Fm01IndicatorFormState
}
