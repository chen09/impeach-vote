# 多语言支持设置

## 概述

本项目现在支持8种语言：
- 英语 (en)
- 中文 (zh)
- 日语 (ja)
- 西班牙语 (es)
- 葡萄牙语 (pt)
- 德语 (de)
- 法语 (fr)
- 意大利语 (it)

## 数据库变更

### 新增表结构

1. **languages** - 语言表
   - id: 主键
   - code: 语言代码 (en, zh, ja, es, pt, de, fr, it)
   - name: 语言名称
   - isActive: 是否激活
   - createdAt, updatedAt: 时间戳

2. **poll_translations** - 投票翻译表
   - id: 主键
   - pollId: 投票ID
   - languageId: 语言ID
   - title: 翻译后的标题
   - description: 翻译后的描述
   - createdAt, updatedAt: 时间戳

3. **option_translations** - 选项翻译表
   - id: 主键
   - optionId: 选项ID
   - languageId: 语言ID
   - text: 翻译后的文本
   - createdAt, updatedAt: 时间戳

### 修改的表

1. **users** - 用户表
   - 新增 languageId 字段，用于存储用户的语言偏好

2. **polls** - 投票表
   - 移除了 title 和 description 字段
   - 新增与 poll_translations 的关联

3. **options** - 选项表
   - 移除了 text 字段
   - 新增与 option_translations 的关联

## 设置步骤

### 1. 安装依赖

```bash
npm install next-intl
```

### 2. 更新数据库

```bash
# 生成Prisma客户端
npm run db:generate

# 推送数据库变更
npm run db:push

# 初始化语言数据
npm run db:init-languages
```

### 3. 启动开发服务器

```bash
npm run dev
```

## 使用方法

### 访问多语言页面

- 英语: http://localhost:3000/en
- 中文: http://localhost:3000/zh
- 日语: http://localhost:3000/ja
- 西班牙语: http://localhost:3000/es
- 葡萄牙语: http://localhost:3000/pt
- 德语: http://localhost:3000/de
- 法语: http://localhost:3000/fr
- 意大利语: http://localhost:3000/it

### 语言切换

页面右上角有语言切换器，可以随时切换语言。

## API变更

### 投票创建API

现在需要提供多语言内容：

```json
{
  "translations": [
    {
      "languageId": "en",
      "title": "English Title",
      "description": "English Description"
    },
    {
      "languageId": "zh",
      "title": "中文标题",
      "description": "中文描述"
    }
  ],
  "options": [
    {
      "translations": [
        {
          "languageId": "en",
          "text": "English Option"
        },
        {
          "languageId": "zh",
          "text": "中文选项"
        }
      ]
    }
  ],
  "isPublic": true
}
```

### 投票获取API

支持语言参数：

```
GET /api/front/polls?languageId=en
GET /api/front/polls?languageId=zh
```

## 文件结构

```
app/
├── [locale]/           # 多语言路由
│   ├── layout.tsx     # 多语言布局
│   └── page.tsx       # 主页面
├── api/
│   ├── languages/     # 语言管理API
│   └── ...
messages/               # 翻译文件
├── en.json
├── zh.json
├── ja.json
├── es.json
├── pt.json
├── de.json
├── fr.json
└── it.json
components/
└── LanguageSwitcher.tsx  # 语言切换器
lib/
└── i18n.ts              # 国际化配置
```

## 注意事项

1. 所有硬编码的文本都已移到翻译文件中
2. 数据库中的投票和选项内容现在支持多语言
3. 用户可以选择语言偏好
4. API响应会根据请求的语言返回相应的翻译内容 