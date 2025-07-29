import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// サポートする言語
export const locales = ['en', 'zh', 'ja', 'es', 'pt', 'de', 'fr', 'it'] as const
export type Locale = (typeof locales)[number]

// 言語名のマッピング
export const languageNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  es: 'Español',
  pt: 'Português',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
}

// 言語コードのマッピング
export const languageCodes: Record<Locale, string> = {
  en: 'en',
  zh: 'zh',
  ja: 'ja',
  es: 'es',
  pt: 'pt',
  de: 'de',
  fr: 'fr',
  it: 'it',
}

// 英語メッセージ（デフォルト）
const enMessages = {
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    vote: "Vote",
    results: "Results",
    language: "Language"
  },
  navigation: {
    home: "Home",
    login: "Login",
    register: "Register",
    logout: "Logout",
    profile: "Profile",
    createPoll: "Create Poll",
    myPolls: "My Polls"
  },
  polls: {
    title: "Voting System",
    latestPolls: "Latest Polls",
    createNewPoll: "Create New Poll",
    noPolls: "No polls available",
    pollTitle: "Poll Title",
    pollDescription: "Poll Description",
    pollOptions: "Please select an option",
    addOption: "Add Option",
    removeOption: "Remove Option",
    isPublic: "Public Poll",
    isPrivate: "Private Poll",
    createdBy: "Created by",
    votes: "votes",
    voteNow: "Vote Now",
    vote: "Vote",
    viewResults: "View Results",
    createPollSuccess: "Poll created successfully",
    createPollError: "Failed to create poll",
    fetchPollsError: "Failed to fetch polls",
    voteSuccess: "Vote submitted successfully! Redirecting to results page...",
    voteError: "Failed to submit vote",
    alreadyVoted: "You have already voted in this poll"
  }
}

// 内联消息对象
const messagesMap: Record<Locale, any> = {
  en: enMessages,
  zh: {
    common: {
      loading: "加载中...",
      error: "错误",
      success: "成功",
      cancel: "取消",
      save: "保存",
      delete: "删除",
      edit: "编辑",
      create: "创建",
      back: "返回",
      next: "下一步",
      previous: "上一步",
      submit: "提交",
      vote: "投票",
      results: "结果",
      language: "语言"
    },
    navigation: {
      home: "首页",
      login: "登录",
      register: "注册",
      logout: "退出",
      profile: "个人资料",
      createPoll: "创建投票",
      myPolls: "我的投票"
    },
    polls: {
      title: "投票系统",
      latestPolls: "最新投票",
      createNewPoll: "创建新投票",
      noPolls: "暂无投票",
      pollTitle: "投票标题",
      pollDescription: "投票描述",
      pollOptions: "请选择选项",
      addOption: "添加选项",
      removeOption: "删除选项",
      isPublic: "公开投票",
      isPrivate: "私密投票",
      createdBy: "创建者",
      votes: "票",
      voteNow: "立即投票",
      vote: "投票",
      viewResults: "查看结果",
      createPollSuccess: "投票创建成功",
      createPollError: "创建投票失败",
      fetchPollsError: "获取投票失败",
      voteSuccess: "投票提交成功！正在跳转到结果页面...",
      voteError: "提交投票失败",
      alreadyVoted: "您已经在此投票中投过票了"
    }
  },
  ja: enMessages,
  es: enMessages,
  pt: enMessages,
  de: enMessages,
  fr: enMessages,
  it: enMessages
}

export default getRequestConfig(async ({ locale }) => {
  // サポートされていない言語の場合は404
  if (!locales.includes(locale as Locale)) notFound()

  // 静的マップからメッセージを取得
  const messages = messagesMap[locale as Locale] || messagesMap.en

  return {
    messages,
    locale: locale as string
  }
}) 