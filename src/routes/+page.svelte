<script lang="ts">
	import { enhance } from '$app/forms';
	let roomNumber: string = '';
</script>

<div class="columns">
	<div class="column is-offset-one-quarter is-three-fifths is-flex is-align-items-center">
		<div class="container is-flex is-justify-content-center">
			<div class="box notification is-primary">
				<p>Join room</p>
				<!-- todo: if room not exist, do not redirect and write error in form -->
				<div class="columns mb-0" style="height: auto;">
					<div class="column">
						<form action="/room/{roomNumber}">
							<div class="columns">
								<div class="column is-two-third pr-0">
									<input
										class="input"
										type="text"
										inputmode="numeric"
										bind:value={roomNumber}
										placeholder="1518"
									/>
								</div>
								<div class="column is-one-third">
									<button class="button" style="width: 100%;" disabled={!roomNumber}>Join</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<p class="mb-3">- Or -</p>
				<div class="columns">
					<div class="column">
						<form action="/?/createNewRoom" method="POST" use:enhance>
							<button class="is-size-6 is-white button">Create a new room</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.columns {
		height: 100%;
	}
</style>
