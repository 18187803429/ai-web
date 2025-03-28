import { FireOutlined, ReadOutlined } from '@ant-design/icons'
import { Bubble, Prompts } from '@ant-design/x'
import type { GetProp } from 'antd'
import OpenAI from 'openai'

export const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: '图像生成',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />
  },
  {
    key: '2',
    description: '选址服务',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />
  },
  {
    key: '3',
    description: '短视频优化',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />
  },
  {
    key: '4',
    description: '文案宣传',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />
  },
  {
    key: '5',
    description: '更多++',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />
  }
]

export const roles: GetProp<typeof Bubble.List, 'roles'> = {
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

export const client = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: 'sk-74d9bde918254d37a127a34da561c3ee',
  dangerouslyAllowBrowser: true
})
