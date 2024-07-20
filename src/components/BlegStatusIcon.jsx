import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { SvgXml as SvgXmlRaw } from 'react-native-svg'
import axios from 'axios'
import BlegIcon from '../assets/icons/customIcons/BlegIcon'

function BlegStatusIcon({ url, size, fill }) {
  const [loading, setLoading] = useState(true)
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [svgXml, setSvgXml] = useState(null)

  useEffect(() => {
    const handleValidateUrl = async () => {
      try {
        const response = await axios.get(url, { timeout: 3000 })
        if (response?.status) {
          setSvgXml(response.data)
          setIsValidUrl(true)
        }
      } catch (error) {
        console.log('error', error)
        setIsValidUrl(false)
      } finally {
        setLoading(false)
      }
    }

    handleValidateUrl()
  }, [url])

  if (loading) {
    return <ActivityIndicator size={'large'} color={fill} />
  }

  return (
    <>
      {!isValidUrl ? (
        <BlegIcon name="icon_sensor" color={fill} size={30} />
      ) : (
        <SvgXmlRaw xml={svgXml} width={size} height={size} fill={fill} />
      )}
    </>
  )
}

export default BlegStatusIcon
