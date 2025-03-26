import { Attachments, Bubble, Conversations, Prompts, Sender, Welcome, useXAgent, useXChat } from '@ant-design/x'
import { createStyles } from 'antd-style'
import React, { useEffect } from 'react'
import OpenAI from 'openai'

import {
  CloudUploadOutlined,
  EllipsisOutlined,
  FireOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import { Badge, Button, type GetProp, Space } from 'antd'

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
)

const defaultConversationsItems = [
  {
    key: '0',
    label: '新对话'
  }
]

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100vw;
      height: 100%;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `
  }
})

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, '热门推荐'),
    description: '探索热门餐饮趋势',
    children: [
      {
        key: '1-1',
        description: '近期有哪些餐饮热点？'
      },
      {
        key: '1-2',
        description: '如何选择最佳餐饮位置？'
      },
      {
        key: '1-3',
        description: '哪些地区美食最火爆？'
      }
    ]
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, '选址指南'),
    description: '助您找到理想餐饮位置',
    children: [
      {
        key: '2-1',
        description: '如何分析商圈数据？'
      },
      {
        key: '2-2',
        description: '推荐哪些地区适合开餐厅？'
      },
      {
        key: '2-3',
        description: '如何提升选址成功率？'
      }
    ]
  }
]

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: '热门推荐',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />
  },
  {
    key: '2',
    description: '选址指南',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />
  }
]

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16
      }
    }
  },
  local: {
    placement: 'end',
    variant: 'shadow'
  }
}

const client = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: 'sk-74d9bde918254d37a127a34da561c3ee',
  dangerouslyAllowBrowser: true
})

const Home: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle()

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = React.useState(false)

  const [content, setContent] = React.useState('')

  const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems)

  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key)

  const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>([])

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate, onError }) => {
      let content: string = ''

      try {
        const stream = await client.chat.completions.create({
          model: 'qwen-plus',
          messages: [{ role: 'user', content: message! }],
          stream: true
        })

        for await (const chunk of stream) {
          content += chunk.choices[0]?.delta?.content || ''
          onUpdate(content)
        }

        onSuccess(content)
      } catch (error: any) {
        onError(error)
      }
    }
  })

  const { onRequest, messages, setMessages } = useXChat({
    agent
  })

  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([])
    }
  }, [activeKey])

  // 加载保存的对话
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations')
    if (savedConversations) {
      setConversationsItems(JSON.parse(savedConversations))
    }
  }, [])

  // 保存对话到 localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversationsItems))
  }, [conversationsItems])

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return
    onRequest(nextContent)
    setContent('')
  }

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string)
  }

  const onAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: `${conversationsItems.length}`,
        label: `新对话`
      }
    ])
    setActiveKey(`${conversationsItems.length}`)
  }

  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
    setActiveKey(key)
  }

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) => setAttachedFiles(info.fileList)

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="你好，我是 TastePilot"
        description="专为餐饮行业和选址决策打造的智能助手，助您轻松获取精准数据，优化选址与经营策略~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
      <Prompts
        title="你想要了解什么？"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%'
          },
          item: {
            flex: 1
          }
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  )

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message
  }))

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
    </Badge>
  )

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0
        }
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
                icon: <CloudUploadOutlined />,
                title: '上传文件',
                description: '单击或拖动文件到此区域进行上传'
              }
        }
      />
    </Sender.Header>
  )

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
      />
      <span>TastePilot</span>
    </div>
  )

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 添加会话 */}
        <Button onClick={onAddConversation} type="link" className={styles.addBtn} icon={<PlusOutlined />}>
          新对话
        </Button>
        {/* 🌟 会话管理 */}
        <Conversations
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className={styles.chat}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
          roles={roles}
          className={styles.messages}
        />
        {/* 🌟 提示词 */}
        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          header={senderHeader}
          onSubmit={onSubmit}
          onChange={setContent}
          prefix={attachmentsNode}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
    </div>
  )
}

export default Home
