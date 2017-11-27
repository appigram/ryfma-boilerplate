import React from 'react'
import { translate } from 'react-i18next'
import {Notification} from '../Notification/Notification'
import { Button, Image, Modal, Icon } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Cropper from 'react-cropper'

class ImageEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      src: this.props.defaultImg || '',
      name: '',
      openDeleteImage: false,
      imageUploading: false
    }
  }

  // Modal functions
  show = (dimmer) => () => this.setState({ dimmer, open: true, openDeleteImage: false })
  close = () => this.setState({ open: false, openDeleteImage: false, src: '', name: '' })

  cropAndExport = (img, width, height) => {
    // create a temporary canvas sized to the cropped size
    const tmpCanvas = document.createElement('canvas')
    const tmpContext = tmpCanvas.getContext('2d')
    tmpCanvas.width = width
    tmpCanvas.height = height
    // use the extended from of drawImage to draw the
    // cropped area to the temp canvas
    const srcWidth = width === height ? img.height : width
    const srcHeight = width === height ? img.height : height
    if (this.props.objectType === 'user') {
      tmpContext.drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, width, height)
    } else {
      tmpContext.drawImage(img, img.width / 2 - width / 2, 0, srcWidth, srcHeight, 0, 0, width, height)
    }
    // return the .toDataURL of the temp canvas
    return tmpCanvas
  }

  onCrop = () => {
    if (this.props.objectType === 'user' && this.props.defaultImg) {
      this.removeImgFromDB(this.props.defaultImg, true)
    }
    this.setState({
      imageUploading: true
    })

    console.log(this.cropper)
    const fullCanvas = this.props.objectType === 'user'
      ? this.cropper.getCroppedCanvas({ height: 200 })
      : (this.cropper.getCroppedCanvas({ height: 250 }))
    const fullThumb = fullCanvas.toDataURL('image/png')
    const metaContext = {
      filename: this.state.name,
      fullCanvas: fullCanvas,
      fullThumb: fullThumb,
      middleCanvas: null,
      smallCanvas: null
    }
    const medImgSrc = document.getElementById('origImg')
    medImgSrc.onload = () => {
      if (this.props.objectType === 'post') {
        metaContext.middleCanvas = this.cropAndExport(medImgSrc, 150, 150)
        metaContext.smallCanvas = this.cropAndExport(medImgSrc, 64, 150)
        this.props.updateCanvasData(metaContext)
      } else if (this.props.objectType === 'user') {
        metaContext.middleCanvas = this.cropAndExport(medImgSrc, 64, 64)
        metaContext.smallCanvas = this.cropAndExport(medImgSrc, 32, 32)
        this.props.updateCanvasData(metaContext)
      }
      this.setState({
        open: false,
        openDeleteImage: false,
        imageUploading: false,
        src: fullThumb
      })
    }
    medImgSrc.src = fullThumb
  }

  onDrop = (files) => {
    if (files[0].type === 'image/png' ||
      files[0].type === 'image/jpeg' ||
      files[0].type === 'image/jpg') {
      this.setState({
        open: true,
        openDeleteImage: false,
        name: files[0].name,
        src: files[0].preview
      })
    }
  }

  async removeImgFromDB (imgUrl, silent) {
    const params = {
      type: this.props.objectType,
      objectId: this.props.objectId,
      imgUrl: imgUrl
    }
    try {
      const response = await this.props.removeImageFromS3(params)
      if (response) {
        if (!silent) Notification.success(this.props.t('common:notif.imageDeleted'))
        this.setState({
          src: ''
        })
      } else {
        if (!silent) Notification.error(this.props.t('common:notif.imageCantToDelete'))
      }
    } catch (error) {
      Notification.error(error)
    }
  }

  removeImg = () => {
    if (this.props.defaultImg) {
      this.removeImgFromDB(this.props.defaultImg)
    } else {
      this.setState({
        open: false,
        openDeleteImage: false,
        src: '',
        name: ''
      })
      this.props.updateCanvasData('')
    }
  }

  handleRotateImage = (degree) => {
    this.cropper.rotate(degree)
  }

  handleZoomImage = (scale) => {
    this.cropper.rotate(scale)
  }

  render () {
    const { t } = this.props
    const { open, dimmer, openDeleteImage } = this.state
    let aspectRatio = 680 / 250 // default
    if (this.props.objectType === 'user') {
      aspectRatio = 1
    }
    return (
      <div className='image-editor-wrapper'>
        {this.state.src || this.props.objectType === 'user'
          ? <div className='image-editor-preview'>
            <div className='image-editor-actions'>
              {this.props.objectType === 'user'
                ? <Icon
                  className='change-user-avatar'
                  name='paint brush'
                  color='white'
                />
                : <Icon
                  onClick={(event) => {
                    event.preventDefault()
                    this.setState({ openDeleteImage: true })
                  }}
                  circular
                  name='close'
                />
              }
              <Modal size='small' open={openDeleteImage} onClose={() => this.setState({ openDeleteImage: false })}>
                <Modal.Header>
                  {t('common:imageEditor.deleteImageHeader')}
                </Modal.Header>
                <Modal.Content>
                  <p>{t('common:imageEditor.deleteImageText')}</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button negative onClick={() => this.setState({ openDeleteImage: false })}>
                    {t('common:no')}
                  </Button>
                  <Button positive icon='checkmark' labelPosition='right' content={t('common:yes')} onClick={this.removeImg} />
                </Modal.Actions>
              </Modal>
            </div>
            <Modal
              id='image-editor-canvas'
              size='small'
              dimmer={dimmer}
              open={open}
              closeOnRootNodeClick={false}
              onClose={this.close}
            >
              <Modal.Header>{t('common:imageEditor.editImageHeader')}</Modal.Header>
              <Modal.Content>
                <Cropper
                  ref={(ref) => this.cropper = ref}
                  src={this.state.src}
                  style={{ height: 480, width: 720, margin: '0 auto' }}
                  onCrop={this.onCrop}
                  // Cropper.js options
                  viewMode={1}
                  aspectRatio={aspectRatio}
                  guides
                  dragMode='move'
                  minCropBoxHeight={150}
                />
                <div id='image-editor-preview' />
                <img id='origImg' className='hidden' src='' />
                {/* <img id='middleImg' className='hidden' src={this.state.midImg} /> */}
              </Modal.Content>
              <Modal.Actions>
                <div className='photo-actions'>
                  <Icon
                    onClick={() => this.handleRotateImage(-90)}
                    circular
                    name='undo'
                  />
                  <Icon
                    onClick={() => this.handleRotateImage(90)}
                    circular
                    name='repeat'
                  />
                  <Icon
                    onClick={() => this.handleZoomImage(0.1)}
                    circular
                    name='zoom in'
                  />
                  <Icon
                    onClick={() => this.handleZoomImage(-0.1)}
                    circular
                    name='zoom out'
                  />
                </div>
                <Button color='grey' basic onClick={this.close}>
                  {t('common:form.cancel')}
                </Button>
                <Button
                  positive
                  disabled={this.state.imageUploading}
                  icon='checkmark'
                  labelPosition='right'
                  content={t('common:imageEditor.applyChanges')}
                  onClick={this.onCrop} />
              </Modal.Actions>
            </Modal>
            {this.props.objectType === 'user'
              ? <Dropzone className='avatar-editor-drop' onDrop={this.onDrop}>
                <Image
                  className={this.props.className}
                  wrapped
                  size='huge'
                  src={this.props.defaultImg}
                />
              </Dropzone>
              : <Image
                className={this.props.className}
                wrapped
                size='huge'
                src={this.state.src}
              />
            }
          </div>
          : <Dropzone className='image-editor-drop' onDrop={this.onDrop}>
            <Icon name='image' size='huge' color='grey' />
            <div>{t('common:imageEditor.dropFilesHere')}<br /> {t('common:imageEditor.clickToSelect')}</div>
          </Dropzone>
        }
      </div>
    )
  }
}

const removeImageFromS3 = gql`
  mutation removeImageFromS3($type: String, $objectId: String, $imgUrl: String!, $silent: Boolean) {
    removeImageFromS3(
      type: $type,
      objectId: $objectId,
      imgUrl: $imgUrl,
      silent: $silent,
    )
  }
`

ImageEditor = graphql(removeImageFromS3, {
  props ({ mutate }) {
    return {
      removeImageFromS3 (variables) {
        return mutate({ variables })
      }
    }
  }
})(ImageEditor)

export default translate()(ImageEditor)
