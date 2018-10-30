import * as React from 'react'
import styled from 'styled-components'
import { IFileValue } from 'src/forms'
import { ActionPage } from '@opencrvs/components/lib/interface'
import { OverlayContainer } from './ImageUploadOption'

const PreviewContainer = OverlayContainer.extend`
  background: ${({ theme }) => theme.colors.black};
`
const ImageHolder = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 90px);
`
const Image = styled.img`
  position: absolute;
  max-width: 100vw;
  max-height: 100%;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`

type IProps = {
  previewImage: IFileValue
  backLabel?: string
  title?: string
  goBack: () => void
}

export class ImagePreview extends React.Component<IProps> {
  render = () => {
    const { previewImage, title, backLabel, goBack } = this.props
    return (
      <PreviewContainer>
        <ActionPage
          title={title ? title : 'Preview'}
          backLabel={backLabel}
          goBack={goBack}
        >
          <ImageHolder>
            <Image id="preview_image_field" src={previewImage.data} />
          </ImageHolder>
        </ActionPage>
      </PreviewContainer>
    )
  }
}