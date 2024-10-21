import React from 'react'
import { Pressable, Text } from 'react-native'

interface ButtonProps {
  title: string | React.JSX.Element
  action: () => void
}

const Button: React.FC<ButtonProps> = ({ title, action }: ButtonProps) => {
  return (
    <Pressable
      onPress={action}
      className="bg-[#2aB07c] rounded-lg justify-center items-center py-3"
    >
      <Text className="text-white font-bold text-lg">{title}</Text>
    </Pressable>
  )
}

export default Button
