import { z } from 'zod'

// ユーザー作成スキーマ
export const createUserSchema = z.object({
  email: z.string().email('validation.email'),
  name: z.string().min(1, 'validation.required'),
  password: z.string().min(6, 'validation.passwordMin'),
  languageId: z.string().optional(),
})

// ログインスキーマ
export const loginSchema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(1, 'validation.required'),
})

// 投票作成スキーマ（多言語対応）
export const createPollSchema = z.object({
  translations: z.array(z.object({
    languageId: z.string(),
    title: z.string().min(1, 'validation.titleRequired'),
    description: z.string().optional(),
  })).min(1, 'validation.required'),
  options: z.array(z.object({
    translations: z.array(z.object({
      languageId: z.string(),
      text: z.string().min(1, 'validation.optionRequired'),
    })).min(1, 'validation.required'),
  })).min(2, 'validation.optionsMin'),
  isPublic: z.boolean().default(true),
})

// 投票実行スキーマ
export const voteSchema = z.object({
  pollId: z.string().min(1, 'validation.required'),
  optionId: z.string().min(1, 'validation.required'),
})

// 型定義
export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreatePollInput = z.infer<typeof createPollSchema>
export type VoteInput = z.infer<typeof voteSchema> 