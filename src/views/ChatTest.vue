<template>
	<div class="chat-container">
		<div class="message-list" ref="messageList">
			<div
				v-for="message in messages"
				:key="message.timestamp"
				class="message-container"
			>
				<div class="message" :class="{ 'from-me': message.fromMe }">
					<div v-if="message.image" class="message-image">
						<img
							:src="message.image"
							class="thumbnail"
							@click="showImage(message.image)"
						/>
					</div>
					<div
						v-if="showFullImage === message.image"
						class="full-image-overlay"
					>
						<img :src="showFullImage" @click="hideImage" class="full-image" />
					</div>
					<div class="message-content">
						<div class="message-text">{{ formatText(message.text) }}</div>
					</div>
				</div>
			</div>
		</div>
		<form class="input-container" @submit.prevent="sendMessage">
			<div>
				<label for="image-upload" class="image-button">
					<i class="fas fa-image"></i>
				</label>
				<input
					id="image-upload"
					type="file"
					accept="image/*"
					style="display: none"
					@change="onImageSelected"
				/>
			</div>
			<div class="text-container">
				<textarea
					v-model="newMessage"
					class="text-input"
					placeholder="Nachricht eingeben..."
				></textarea>
				<button type="button" class="send-button" @click="sendMessage">
					Send
				</button>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				messages: [],
				newMessage: "",
				newImage: null,
				showFullImage: null,
			};
		},
		methods: {
			sendMessage() {
				let message = null;
				if (this.newImage) {
					const reader = new FileReader();
					reader.readAsDataURL(this.newImage);
					reader.onload = () => {
						message = {
							type: "image",
							text: this.newMessage,
							image: reader.result,
							timestamp: Date.now(),
							fromMe: true,
						};
						this.messages.push(message);
						this.newImage = null;
						this.newMessage = "";
					};
				} else {
					message = {
						type: "text",
						text: this.newMessage,
						image: null,
						timestamp: Date.now(),
						fromMe: true,
					};
					this.messages.push(message);
					this.newMessage = "";
				}
			},
			onImageSelected(event) {
				this.newImage = event.target.files[0];
			},
			openImageDialog() {
				this.$refs.imageInput.click();
			},
			showImage(imageUrl) {
				this.showFullImage = imageUrl;
			},
			hideImage() {
				this.showFullImage = null;
			},
			formatText(text) {
				return text.replaceAll("\n", "<br>");
			},
		},
	};
</script>

<style scoped>
	.chat-container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.message-list {
		flex-grow: 1;
		overflow-y: auto;
		padding: 10px;
	}

	.message-container {
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
	}

	.message {
		display: flex;
		align-items: center;
	}

	.message-image {
		margin-right: 10px;
	}

	.thumbnail {
		max-width: 200px;
		max-height: 200px;
	}

	.message-content {
		background-color: #eee;
		padding: 10px;
		border-radius: 10px;
	}

	.message-text {
		white-space: pre-wrap;
	}

	.message-timestamp {
		font-size: 12px;
		color: gray;
		margin-top: 5px;
	}

	.input-container {
		display: flex;
		align-items: center;
		padding: 10px;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 999;
	}

	.image-button {
		border: none;
		background-color: transparent;
		font-size: 20px;
		color: gray;
	}

	.text-container {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 10px;
	}

	.text-input {
		flex-grow: 1;
		border: none;
		resize: none;
		font-size: 16px;
		padding: 10px;
		border-radius: 10px;
	}

	.send-button {
		border: none;
		background-color: transparent;
		font-size: 20px;
		color: #007aff;
	}
	.full-image-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.full-image {
		max-width: 90%;
		max-height: 90%;
	}
</style>
