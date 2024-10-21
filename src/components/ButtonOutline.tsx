import React from 'react'
import { Pressable, Text } from 'react-native'

interface ButtonOutLineProps {
  title: string
  action?: () => void
  children?: React.ReactNode
}

const ButtonOutline: React.FC<ButtonOutLineProps> = ({
  title,
  action,
  children,
}: ButtonOutLineProps) => {
  return (
    <Pressable
      onPress={action}
      className="border-2 border-neutral-400 rounded-lg justify-center items-center py-3 flex-row space-x-2"
    >
      {children && (
        <>
          <Text> {children}</Text>
        </>
      )}
      <Text className="text-neutral-400 font-bold text-lg">{title}</Text>
    </Pressable>
  )
}

export default ButtonOutline
