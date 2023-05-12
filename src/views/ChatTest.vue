<template>
	<div>
		<div v-for="(message, index) in messages" :key="index">
			<div v-if="message.type === 'text'">
				<p v-html="formatText(message.text)"></p>
				<div v-if="message.image" class="message-image">
					<img
						:src="message.image"
						@click="showImage(message.image)"
						class="thumbnail"
					/>
				</div>
			</div>
			<div v-else-if="message.type === 'image'">
				<div class="message-image">
					<img
						:src="message.image"
						@click="showImage(message.image)"
						class="thumbnail"
					/>
				</div>
				<p v-html="formatText(message.text)"></p>
			</div>
		</div>
		<form @submit.prevent="sendMessage">
			<textarea
				v-model="newMessage"
				placeholder="Type your message"
				rows="3"
			></textarea>
			<input type="file" @change="onFileChange" />
			<button>Send</button>
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
					message = {
						type: "image",
						text: this.newMessage,
						image: URL.createObjectURL(this.newImage),
						timestamp: Date.now(),
					};
					this.newImage = null;
				} else {
					message = {
						type: "text",
						text: this.newMessage,
						image: null,
						timestamp: Date.now(),
					};
				}
				this.messages.push(message);
				this.newMessage = "";
			},
			onFileChange(event) {
				this.newImage = event.target.files[0];
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
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
		cursor: pointer;
	}

	.full-image-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.full-image {
		max-width: 90vw;
		max-height: 90vh;
	}

	.message-image {
		display: inline-block;
		margin-right: 10px;
	}
</style>
