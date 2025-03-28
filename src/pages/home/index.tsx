import { useState } from 'react'
import { CloudUploadOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons'
import { Attachments, Bubble, Conversations, Prompts, Sender, Welcome, useXAgent, useXChat } from '@ant-design/x'
import { Badge, Button, type GetProp, Space } from 'antd'
import { nanoid } from 'nanoid'
import { useAppSelector } from '@/store'
import styles from './index.module.less'
import { client, roles, senderPromptsItems } from './interface'

function Home() {
  const conversations = useAppSelector((state) => state.chat.conversations)
  const [headerOpen, setHeaderOpen] = useState(false)
  const [content, setContent] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([])
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

  const onSubmit = (nextContent: string) => {
    if (!nextContent) return
    onRequest(nextContent)
    setContent('')
  }

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string)
  }

  const onAddConversation = () => {
    const key = nanoid()
    setActiveKey(key)
    setMessages([])
  }

  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
    setActiveKey(key)
  }

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) => setAttachedFiles(info.fileList)

  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="你好，RestaurantPilot"
        description="专为餐饮行业和选址决策打造的智能助手，助您轻松获取精准数据，优化选址与经营策略~"
      />
      <Prompts
        title="你想要了解什么？"
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
      title="上传文件"
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
            ? { title: '将文件放到此处' }
            : {
                icon: <CloudUploadOutlined />,
                title: '上传文件',
                description: '单击或拖动文件到此区域进行上传'
              }
        }
      />
    </Sender.Header>
  )

  return (
    <div className={styles.root}>
      <div className="menu">
        <div className="logo">
          <img
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
            draggable={false}
            alt="logo"
          />
          <span>RestaurantPilot</span>
        </div>
        <Space direction="vertical">
          <Button
            className="justify-start"
            size="large"
            block
            variant="link"
            color="pink"
            icon={<PlusOutlined />}
            onClick={onAddConversation}
          >
            图像生成
          </Button>
        </Space>
        <Conversations
          items={conversations}
          className="conversations"
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className="chat">
        <Bubble.List
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
          roles={roles}
          className="messages"
        />
        <Sender
          value={content}
          header={senderHeader}
          onSubmit={onSubmit}
          onChange={setContent}
          prefix={attachmentsNode}
          loading={agent.isRequesting()}
          className="sender"
        />
        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
      </div>
    </div>
  )
}

export default Home
