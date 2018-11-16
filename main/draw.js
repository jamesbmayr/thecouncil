/*** pools ***/
	/* colors */
		var colorSlots = ["primary", "secondary", "tertiary", "quarternary", "quintary"]
		var colors = {
			transparent:["transparent","transparent","transparent","transparent","transparent"],
			magenta:    ["#ffcce6","#ff66b3","#e60073","#99004d","#33001a"],
			red:        ["#fab7b7","#f66f6f","#d80e0e","#7c0808","#300303"],
			brown:      ["#e09b06","#ae7804","#7c5603","#513802","#191101"],
			browngray:  ["#d5cac3","#b6a196","#a18778","#786154","#4f4037"],
			orange:     ["#fde4ce","#f9ae6c","#f68523","#ab5407","#442103"],
			beige:      ["#f7f4ed","#e0d3b8","#c1a871","#91773f","#6a572f"],
			yellow:     ["#f6f4d5","#e5dd80","#d8cb41","#beb227","#7f771a"],
			green:      ["#a9d3ab","#539e57","#1a661e","#074f0b","#053007"],
			greengray:  ["#d3ded4","#99b29b","#6a8c6c","#4d664e","#374938"],
			cyan:       ["#e6ffff","#b3ffff","#33ffff","#00cccc","#008080"],
			cerulean:   ["#dae7f1","#90b8d5","#4689b9","#2b5572","#1c374a"],
			bluegray:   ["#dee9ed","#adc8d2","#7ba7b7","#487484","#2d4852"],
			blue:       ["#d0e0fb","#7a9bd3","#2b76ef","#0b3d8e","#04142f"],
			purple:     ["#dac0f7","#b08bda","#7b3dc2","#4a2574","#180c26"],
			black:      ["#e4e6e7","#a2a7a9","#6e7477","#3d4142","#111111"],
			white:      ["#c0dee5","#cee2e8","#dcf1f7","#e3f5f9","#f9fdff"]
		}

	/* symbols */
		var symbols = {
			none:           null,
			circle:         null,
			ring:           null,
			triangle: 		"50% 7%, 0% 93%, 100% 93%",
			square: 		"0% 0%, 100% 0%, 100% 100%, 0% 100%",
			diamond: 		"50% 0%, 100% 50%, 50% 100%, 0% 50%",
			parallelogram: 	"25% 0%, 100% 0%, 75% 100%, 0% 100%",
			rectangle: 		"0% 20%, 100% 20%, 100% 80%, 0% 80%",
			trapezoid: 		"20% 0%, 80% 0%, 100% 100%, 0% 100%",
			pentagon: 		"50% 1.5%, 100% 38%, 81% 96.5%, 19% 96.5%, 0% 38%",
			hexagon: 		"50% 0%, 93.5% 25%, 93.5% 75%, 50% 100%, 6.5% 75%, 6.5% 25%",
			septagon: 		"50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%",
			octagon: 		"30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%",
			nonagon: 		"50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%",
			decagon: 		"50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%",
			dodecagon: 		"38% 5%, 62% 5%, 82.5% 17.5%, 95% 38%, 95% 62%, 82.5% 82.5%, 62% 95%, 38% 95%, 17.5% 82.5%, 5% 62%, 5% 38%, 17.5% 17.5%",
			star: 			"50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%",
			chevron: 		"50% 0%, 100% 100%, 50% 75%, 0 100%",
			plus: 			"0% 33%, 33% 33%, 33% 0%, 67% 0%, 67% 33%, 100% 33%, 100% 67%, 67% 67%, 67% 100%, 33% 100%, 33% 67%, 0% 67%",
			cross: 			"40% 40%, 40% -150%, 60% -150%, 60% 40%, 250% 40%, 250% 60%, 60% 60%, 60% 250%, 40% 250%, 40% 60%, -150% 60%, -150% 40%, 40% 40%",
			x: 				"-170% -150%, -150% -170%, 50% 30%, 250% -170%, 270% -150%, 70% 50%, 270% 250%, 250% 270%, 50% 70%, -150% 270%, -170% 250%, 30% 50%",
			jack:           "-170% -150%, -150% -170%, 50% 30%, 250% -170%, 270% -150%, 70% 50%, 270% 250%, 250% 270%, 50% 70%, -150% 270%, -170% 250%, 30% 50%, 40% 40%, 40% -150%, 60% -150%, 60% 40%, 250% 40%, 250% 60%, 60% 60%, 60% 250%, 40% 250%, 40% 60%, -150% 60%, -150% 40%, 40% 40%, 30% 50%",
			arrow: 			"100% 50%, 67% 50%, 67% 100%, 33% 100%, 33% 50%, 0% 50%, 50% 0%",	
			rabbit: 		"29% 6%, 30% 13%, 30% 18%, 30% 23%, 30% 30%, 31% 36%, 34% 42%, 36% 49%, 34% 57%, 31% 65%, 30% 72%, 31% 80%, 34% 86%, 39% 90%, 45% 94%, 50% 95%, 55% 94%, 61% 90%, 66% 86%, 69% 80%, 70% 72%, 69% 65%, 66% 57%, 64% 49%, 66% 42%, 69% 36%, 70% 30%, 70% 23%, 70% 18%, 70% 13%, 71% 6%, 70.5% 5%, 69.5% 4%, 69% 4%, 66% 7%, 64% 11%, 61% 18%, 57% 27%, 56% 32%, 55% 39%, 54% 45%, 53% 44.5%, 50% 44%, 47% 44.5%, 46% 45%, 45% 39%, 44% 32%, 43% 27%, 39% 18%, 36% 11%, 34% 7%, 31% 4%, 30.5% 4%, 29.5% 5%",
			cat: 			"24% 10%, 17% 38%, 13% 46%, 13% 57%, 17% 65%, 25% 74%, 35% 82%, 47% 85%, 53% 85%, 65% 82%, 75% 74%, 83% 65%, 87% 57%, 87% 46%, 83% 38%, 76% 10%, 60% 31%, 40% 31%",
			dog: 			"46% 19%, 54% 19%, 57.75% 20%, 58% 19.5%, 60% 18.25%, 61% 18%, 74% 19.5%, 85% 18%, 88% 20%, 89.75% 22%, 87% 40%, 88% 54%, 87% 57%, 85% 58%, 81.75% 57.5%, 78.5% 55%, 79% 59%, 78.5% 62%, 71% 77%, 70% 80%, 69% 84%, 67% 87%, 64% 88.5%, 62% 88.8%, 61% 89%, 56% 88%, 50.13% 90.05% , 44% 88%, 39% 89%, 38% 88.8%, 36% 88.5%, 33% 87%, 31% 84%, 30% 80%, 29% 77%, 21.5% 62%, 21% 59%, 21.5% 55%, 19.25% 57.5%, 15% 58%, 13% 57%, 12% 54%, 13% 40%, 10.25% 22%, 12% 20%, 15% 18%, 26% 19.5%, 39% 18%, 40% 18.25%, 42% 19.5%, 42.25% 20%",
			heart:          "50% 100%, 16.61% 71.68%, 5.85% 59.18%, 1.27% 48.73%, 0% 39.24%, 1.27% 28.64%, 5.7% 16.93%, 13.45% 8.23%, 22.63% 4.59%, 32.28% 4.59%, 39.56% 7.12%, 43.99% 10.92%, 45.89% 14.08%, 47.78% 18.2%, 49.21% 22.94%, 49.68% 25%, 50% 27%, 50.32% 25%, 50.79% 22.94%, 52.22% 18.2%, 54.11% 14.08%, 56.01% 10.92%, 60.44% 7.12%, 67.72% 4.59%, 77.37% 4.59%, 86.55% 8.23%, 94.3% 16.93%, 98.73% 28.64%, 100% 39.24%, 98.73% 48.73%, 94.15% 59.18%, 83.39% 71.68%",
			snowflake:      "50% 50%, 47.83% 42.35%, 35.19% 39.25%, 31.02% 34.11%, 26.43% 35.11%, 15.13% 29.68%, 12.38% 24.63%, 7.21% 26.95%, 8.02% 32.52%, 13.7% 32.15%, 24.53% 38.4%, 26.25% 42.68%, 32.7% 43.86%, 42.6% 52.67%, 50% 50%, 42.29% 48.05%, 33.29% 57.45%, 26.75% 58.49%, 25.32% 62.97%, 14.97% 70.04%, 9.22% 69.89%, 8.64% 75.53%, 13.87% 77.62%, 16.39% 72.51%, 27.22% 66.26%, 31.79% 66.91%, 36.03% 61.91%, 48.61% 57.74%, 50% 50%, 44.46% 55.7%, 48.1% 68.2%, 45.73% 74.38%, 48.89% 77.86%, 49.84% 90.36%, 46.84% 95.26%, 51.43% 98.58%, 55.85% 95.1%, 52.69% 90.36%, 52.69% 77.86%, 55.54% 74.23%, 53.33% 68.05%, 56.01% 55.07%, 50% 50%, 52.17% 57.65%, 64.81% 60.75%, 68.98% 65.89%, 73.57% 64.89%, 84.87% 70.32%, 87.62% 75.37%, 92.79% 73.05%, 91.98% 67.48%, 86.3% 67.85%, 75.47% 61.6%, 73.75% 57.32%, 67.3% 56.14%, 57.4% 47.33%, 50% 50%, 57.71% 51.95%, 66.71% 42.55%, 73.25% 41.51%, 74.68% 37.03%, 85.03% 29.96%, 90.78% 30.11%, 91.36% 24.47%, 86.13% 22.38%, 83.61% 27.49%, 72.78% 33.74%, 68.21% 33.09%, 63.97% 38.09%, 51.39% 42.26%, 50% 50%, 55.54% 44.3%, 51.9% 31.8%, 54.27% 25.62%, 51.11% 22.14%, 50.16% 9.64%, 53.16% 4.74%, 48.57% 1.42%, 44.14% 4.9%, 47.31% 9.64%, 47.31% 22.14%, 44.46% 25.78%, 46.67% 31.95%, 43.99% 44.93%",
			teardrop:       "50% 0%, 61.55% 24.37%, 73.89% 50.32%, 79.43% 66.3%, 80.7% 73.73%, 79.75% 80.54%, 76.74% 86.87%, 72.31% 91.93%, 65.98% 96.2%, 57.91% 98.89%, 50% 100%, 42.09% 98.89%, 34.02% 96.2%, 27.69% 91.93%, 23.26% 86.87%, 20.25% 80.54%, 19.3% 73.73%, 20.57% 66.3%, 26.11% 50.32%, 38.45% 24.37%",
			burst:          "45% 35%, 50% 0%, 55% 35%, 51.12% 34.23%, 69.13% 3.81%, 60.36% 38.06%, 57.07% 35.86%, 85.35% 14.65%, 64.14% 42.93%, 61.94% 39.64%, 96.19% 30.87%, 65.77% 48.88%, 65% 45%, 99.99% 50%, 65% 55%, 65.77% 51.12%, 96.18% 69.13%, 61.94% 60.36%, 64.14% 57.07%, 85.34% 85.35%, 57.07% 64.14%, 60.36% 61.94%, 69.12% 96.18%, 51.12% 65.77%, 55% 65%, 49.99% 99.98%, 45% 65%, 48.88% 65.77%, 30.86% 96.17%, 39.64% 61.94%, 42.93% 64.14%, 14.65% 85.33%, 35.86% 57.07%, 38.06% 60.36%, 3.82% 69.11%, 34.23% 51.12%, 35% 55%, 0.02% 49.98%, 35% 45%, 34.23% 48.88%, 3.83% 30.86%, 38.06% 39.64%, 35.86% 42.93%, 14.67% 14.65%, 42.93% 35.86%, 39.64% 38.06%, 30.89% 3.82%, 48.88% 34.23%",
			compass:        "45% 35%, 50% 0%, 55% 35%, 57.07% 35.86%, 85.35% 14.65%, 64.14% 42.93%, 65% 45%, 99.99% 50%, 65% 55%, 64.14% 57.07%, 85.34% 85.35%, 57.07% 64.14%, 55% 65%, 49.99% 99.98%, 45% 65%, 42.93% 64.14%, 14.65% 85.33%, 35.86% 57.07%, 35% 55%, 0.02% 49.98%, 35% 45%, 35.86% 42.93%, 15.98% 14.4%, 42.93% 35.86%",
			flower:         "45% 35%, 47.15% 28.96% , 46.36% 24.68%, 45.41% 21.04%, 45.73% 16.93%, 47.31% 12.82%, 50% 10%, 53.48% 12.82%, 55.54% 17.41%, 55.54% 21.04%, 54.43% 24.37%, 53.32% 29.27%, 55% 35%, 51.12% 34.23%, 55.42% 29.47%, 56.33% 25.21%, 56.84% 21.49%, 58.71% 17.81%, 61.74% 14.62%, 65.31% 13.04%, 67.44% 16.98%, 67.59% 22.01%, 66.2% 25.36%, 63.9% 28.02%, 61% 32.12%, 60.36% 38.06%, 57.07% 35.86%, 62.86% 33.11%, 65.33% 29.52%, 67.23% 26.28%, 70.37% 23.59%, 74.39% 21.81%, 78.29% 21.71%, 78.75% 26.17%, 76.96% 30.87%, 74.4% 33.44%, 71.25% 35.01%, 67.01% 37.69%, 64.14% 42.93%, 61.94% 39.64%, 68.34% 39.32%, 72% 36.95%, 75% 34.68%, 78.93% 33.4%, 83.32% 33.29%, 86.96% 34.69%, 85.68% 38.99%, 82.23% 42.64%, 78.88% 44.04%, 75.37% 44.28%, 70.43% 45.14%, 65.77% 48.88%, 65% 45%, 71.03% 47.15%, 75.32% 46.36%, 78.96% 45.41%, 83.08% 45.73%, 87.18% 47.31%, 90.01% 50%, 87.18% 53.48%, 82.59% 55.53%, 78.96% 55.55%, 75.63% 54.42%, 70.73% 53.33%, 65% 55%, 65.77% 51.12%, 70.52% 55.41%, 74.79% 56.33%, 78.51% 56.84%, 82.2% 58.71%, 85.38% 61.74%, 86.96% 65.31%, 83.02% 67.44%, 77.99% 67.58%, 74.63% 66.21%, 71.99% 63.89%, 67.88% 61.01%, 61.94% 60.36%, 64.14% 57.07%, 66.89% 62.85%, 70.48% 65.33%, 73.72% 67.23%, 76.42% 70.37%, 78.19% 74.39%, 78.29% 78.29%, 73.83% 78.75%, 69.13% 76.95%, 66.55% 74.4%, 65% 71.25%, 62.31% 67.01%, 57.07% 64.14%, 60.36% 61.94%, 60.69% 68.34%, 63.05% 72%, 65.32% 75%, 66.61% 78.93%, 66.71% 83.32%, 65.31% 86.96%, 61.01% 85.68%, 57.36% 82.22%, 55.95% 78.88%, 55.73% 75.37%, 54.86% 70.43%, 51.12% 65.77%, 55% 65%, 52.86% 71.03%, 53.64% 75.32%, 54.59% 78.96%, 54.27% 83.08%, 52.69% 87.18%, 50% 90.01%, 46.52% 87.18%, 44.47% 82.58%, 44.45% 78.96%, 45.59% 75.63%, 46.67% 70.73%, 45% 65%, 48.88% 65.77%, 44.59% 70.52%, 43.67% 74.79%, 43.16% 78.51%, 41.29% 82.2%, 38.26% 85.38%, 34.69% 86.96%, 32.56% 83.02%, 32.42% 77.98%, 33.79% 74.63%, 36.12% 71.99%, 38.99% 67.88%, 39.64% 61.94%, 42.93% 64.14%, 37.15% 66.89%, 34.67% 70.48%, 32.77% 73.72%, 29.63% 76.42%, 25.61% 78.19%, 21.71% 78.29%, 21.25% 73.83%, 23.05% 69.12%, 25.6% 66.55%, 28.76% 65%, 32.99% 62.31%, 35.86% 57.07%, 38.06% 60.36%, 31.66% 60.69%, 28% 63.05%, 25% 65.32%, 21.07% 66.61%, 16.68% 66.71%, 13.04% 65.31%, 14.32% 61.01%, 17.78% 57.35%, 21.12% 55.95%, 24.64% 55.73%, 29.57% 54.86%, 34.23% 51.12%, 35% 55%, 28.97% 52.86%, 24.68% 53.64%, 21.04% 54.59%, 16.92% 54.27%, 12.82% 52.69%, 9.99% 50%, 12.82% 46.52%, 17.42% 44.46%, 21.04% 44.45%, 24.38% 45.59%, 29.27% 46.67%, 35% 45%, 34.23% 48.88%, 29.48% 44.59%, 25.21% 43.67%, 21.49% 43.16%, 17.8% 41.29%, 14.62% 38.26%, 13.04% 34.69%, 16.98% 32.56%, 22.02% 32.41%, 25.37% 33.79%, 28.02% 36.12%, 32.12% 38.99%, 38.06% 39.64%, 35.86% 42.93%, 33.11% 37.15%, 29.52% 34.67%, 26.28% 32.77%, 23.58% 29.63%, 21.81% 25.61%, 21.71% 21.71%, 26.17% 21.25%, 30.88% 23.04%, 33.45% 25.6%, 35% 28.77%, 37.69% 32.99%, 42.93% 35.86%, 39.64% 38.06%, 39.31% 31.66%, 36.95% 28%, 34.68% 25%, 33.39% 21.07%, 33.29% 16.68%, 34.69% 13.04%, 38.99% 14.32%, 42.65% 17.78%, 44.05% 21.12%, 44.27% 24.65%, 45.14% 29.57%, 48.88% 34.23%",
			leaf:           "50% 8%, 42.88% 24.68%, 34.49% 22.15%, 35.92% 35.76%, 24.05% 27.37%, 24.68% 36.23%, 11.71% 38.92%, 19.94% 46.52%, 13.92% 54.59%, 28.64% 53.64%, 24.05% 61.87%, 48.42% 59.49%, 47.78% 92.25%, 50% 92%, 52.22% 92.25%, 51.58% 59.49%, 75.95% 61.87%, 71.36% 53.64%, 86.08% 54.59%, 80.06% 46.52%, 88.29% 38.92%, 75.32% 36.23%, 75.95% 27.37%, 64.08% 35.76%, 65.51% 22.15%, 57.12% 24.68%",
			shield:         "50% 3%, 43.83% 5.86%, 34.02% 7.92%, 27.06% 7.13%, 20.09% 5.7%, 14.24% 4.12%, 11.71% 3.33%, 6.96% 8.39%, 2.37% 20.1%, 1.58% 33.55%, 4.43% 51.75%, 12.66% 66.62%, 19.3% 78.01%, 27.22% 87.66%, 38.45% 94.15%, 50% 97%, 61.55% 94.15%, 72.78% 87.66%, 80.7% 78.01%, 87.34% 66.62%, 95.57% 51.75%, 98.42% 33.55%, 97.63% 20.1%, 93.04% 8.39%, 88.29% 3.33%, 85.76% 4.12%, 79.91% 5.7%, 72.94% 7.13%, 65.98% 7.92%, 56.17% 5.86%",
			sword:          "50% 0%, 48% 15%, 48% 68%, 36% 68%, 33% 66%, 28% 66%, 26% 68%, 25% 70%, 26% 72%, 28% 74%, 33% 74%, 36% 72%, 48% 72%, 48% 87%, 46% 91%, 46% 96%, 48% 99%, 50% 100%, 52% 99%, 54% 96%, 54% 91%, 52% 87%, 52% 72%, 64% 72%, 67% 74%, 72% 74%, 74% 72%, 75% 70%, 74% 68%, 72% 66%, 67% 66%, 64% 68%, 52% 68%, 52% 15%",
			bell:           "50% 8%, 43.35% 9.49%, 38.29% 14.4%, 33.7% 23.26%, 31.65% 34.97%, 28.01% 47.31%, 22.31% 58.7%, 16.46% 67.56%, 9.97% 72.31%, 3.64% 74.84%, 1.27% 77.06%, 0.47% 79.75%, 1.42% 80.7%, 4.91% 81.49%, 12.03% 81.33%, 20.41% 81.49%, 28.16% 81.65%, 35.76% 81.65%, 40.98% 82.28%, 44.46% 84.65%, 45.73% 88.13%, 47.63% 90.98%, 50% 92%, 52.37% 90.98%, 54.27% 88.13%, 55.54% 84.65%, 59.02% 82.28%, 64.24% 81.65%, 71.84% 81.65%, 79.59% 81.49%, 87.97% 81.33%, 95.09% 81.49%, 98.58% 80.7%, 99.53% 79.75%, 98.73% 77.06%, 96.36% 74.84%, 90.03% 72.31%, 83.54% 67.56%, 77.69% 58.7%, 71.99% 47.31%, 68.35% 34.97%, 66.3% 23.26%, 61.71% 14.4%, 56.65% 9.49%",
			crescent:       "1% 50%, 3.48% 68.35%, 10.6% 83.23%, 24.84% 94.15%, 37.5% 97.47%, 51.11% 99.05%, 69.94% 97.31%, 80.85% 91.93%, 87.03% 84.97%, 91.77% 78.32%, 92.88% 73.42%, 92.41% 71.04%, 90.19% 69.46%, 87.03% 70.09%, 84.81% 72.78%, 83.07% 75.32%, 79.59% 78.8%, 74.05% 82.12%, 66.77% 84.65%, 58.7% 83.07%, 51.27% 79.43%, 44.78% 73.26%, 41.3% 67.25%, 39.72% 59.18%, 38.61% 50%, 39.72% 40.82%, 41.3% 32.75%, 44.78% 26.74%, 51.27% 20.57%, 58.7% 16.93%, 66.77% 15.35%, 74.05% 17.88%, 79.59% 21.2%, 83.07% 24.68%, 84.81% 27.22%, 87.03% 29.91%, 90.19% 30.54%, 92.41% 28.96%, 92.88% 26.58%, 91.77% 21.68%, 87.03% 15.03%, 80.85% 8.07%, 69.94% 2.69%, 51.11% 0.95%, 37.5% 2.53%, 24.84% 5.85%, 10.6% 16.77%, 3.48% 31.65%"
		}

	/* patterns */
		var structures = ["solid", "horizontal-stripes", "vertical-stripes", "wedge-stripes", "diamond", "square", "rings", "x", "cross", "jack", "checkers"]
		var angles     = [0, 0, 0, 0, 30, 45, 60, 90, 90, 180, 180, 270, 270, 300, 315, 330]
		var positions  = [
			["4,4"],
			["4,4"],
			["4,4"],
			["4,4"],
			["0,8","8,8","1,7","7,7","2,6","6,6","3,5","5,5","4,4","3,3","5,3","2,2","6,2","1,1","7,1","0,0","8,0"],
			["4,8","4,7","4,6","4,5","0,4","1,4","2,4","3,4","4,4","5,4","6,4","7,4","8,4","4,3","4,2","4,1","4,0"],
			["0,8","8,8","1,7","7,7","2,6","6,6","3,5","5,5","4,4","3,3","5,3","2,2","6,2","1,1","7,1","0,0","8,0","4,8","4,7","4,6","4,5","0,4","1,4","2,4","3,4","5,4","6,4","7,4","8,4","4,3","4,2","4,1","4,0"],
			["3,5","4,5","5,5","3,4","4,4","5,4","3,3","4,3","5,3"],
			["0,8","2,8","4,8","6,8","8,8","1,7","3,7","5,7","7,7","0,6","2,6","4,6","6,6","8,6","1,5","3,5","5,5","7,5","0,4","2,4","4,4","6,4","8,4","1,3","3,3","5,3","7,3","0,2","2,2","4,2","6,2","8,2","1,1","3,1","5,1","7,1","0,0","2,0","4,0","6,0","8,0"],
			["4,6","3,5","4,5","5,5","2,4","3,4","4,4","5,4","6,4","3,3","4,3","5,3","4,2"],
			["4,6","2,4","4,4","6,4","4,2"],
			["4,6","2,4","6,4","4,2"],
			["0,8","1,8","2,8","3,8","0,7","1,7","2,7","3,7","0,6","1,6","2,6","3,6","0,5","1,5","2,5","3,5"],
			["0,7","0,6","1,6","0,5","1,5","2,5","0,4","1,4","2,4","3,4","0,3","1,3","2,3","0,2","1,2","0,1"],
			["1,6"],
			["1,4"],
			["2,6","6,6","4,4","2,2","6,2"],
			["2,6","6,6","2,2","6,2"],
			["1,7","7,7","4,4","1,1","7,1"],
			["1,7","7,7","1,1","7,1"],
			["1,8","3,8","5,8","7,8","0,7","2,7","4,7","6,7","8,7","1,6","3,6","5,6","7,6","0,5","2,5","4,5","6,5","8,5","1,4","3,4","5,4","7,4","0,3","2,3","4,3","6,3","8,3","1,2","3,2","5,2","7,2","0,1","2,1","4,1","6,1","8,1","1,0","3,0","5,0","7,0"]
		]

/*** data ***/
	/* clearData */
		function clearData(data) {
			data = {
				// field
					fieldHue:  "transparent",
					fieldShade: 0,

				// structure
					structure: "solid",
					sectionCount: 0,
					sectionFactor: 0,
					sectionRotation: 0,

				// colors
					primaryHue: "transparent",
					primaryShade: 0,
					secondaryHue: "transparent",
					secondaryShade: 0,
					tertiaryHue: "transparent",
					tertiaryShade: 0,
					quarternaryHue: "transparent",
					quarternaryShade: 0,
					quintaryHue: "transparent",
					quintaryShade: 0,

				// seal
					seal: "none",
					sealHue: "transparent",
					sealShade: 0,
					sealSize: 0,
					sealLayers: 0,
					sealRotation: 0,
					sealPositions: [],

				// ring
					ring: "none",
					ringHue: "transparent",
					ringShade: 0,
					ringCount: 0,
					ringSize: 0,
					ringRadius: 0,
					ringRotation: 0,
					ringPositions: [],

				// emblem
					emblem: "none",
					emblemHue: "transparent",
					emblemShade: 0,
					emblemSize: 0,
					emblemRotation: 0,
					emblemPositions: [],
			}

			return data
		}

	/* randomizeData */
		function randomizeData(data) {
			// clear
				data = clearData(data)

			// color pool
				var hues = [
					[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
					[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
					[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
					[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
					[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
					[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)]
				]

			// position
				var position = chooseRandom(positions)

			// field
				data.fieldHue = chooseRandom(hues)
				data.fieldShade = data.fieldHue[1]
				data.fieldHue = data.fieldHue[0]

			// structure
				data.structure = chooseRandom(structures)
				data.sectionCount = (data.structure == "solid") ? 1 : data.structure.includes("stripes") ? (Math.floor(Math.random() * 7) + 2) * (data.structure == "wedge-stripes" ? 2 : 1) : (data.structure == "checkers") ? Math.pow((Math.floor(Math.random() * 6) + 2), 2) : (Math.floor(Math.random() * 4) + 1)
				data.sectionFactor = Math.floor(Math.random() * 7) - 3
				data.sectionRotation = chooseRandom(angles)

			// colors
				data.primaryHue = chooseRandom(hues)
				data.primaryShade = data.primaryHue[1]
				data.primaryHue = data.primaryHue[0]

				data.secondaryHue = chooseRandom(hues)
				data.secondaryShade = data.secondaryHue[1]
				data.secondaryHue = data.secondaryHue[0]

				data.tertiaryHue = Math.floor(Math.random() * 2) ? null : chooseRandom(hues)
				data.tertiaryShade = data.tertiaryHue ? data.tertiaryHue[1] : 0
				data.tertiaryHue = data.tertiaryHue ? data.tertiaryHue[0] : "transparent"

				data.quarternaryHue = data.tertiaryHue && Math.floor(Math.random() * 4) ? null : chooseRandom(hues)
				data.quarternaryShade = data.quarternaryHue ? data.quarternaryHue[1] : 0
				data.quarternaryHue = data.quarternaryHue ? data.quarternaryHue[0] : "transparent"

				data.quintaryHue = data.quarternaryHue && Math.floor(Math.random() * 6) ? null : chooseRandom(hues)
				data.quintaryShade = data.quintaryHue ? data.quintaryHue[1] : 0
				data.quintaryHue = data.quintaryHue ? data.quintaryHue[0] : "transparent"

			// seal
				data.seal = Math.floor(Math.random() * 3) ? "none" : chooseRandom(Object.keys(symbols))
				data.sealHue = data.seal == "none" ? "transparent" : chooseRandom(hues)
				data.sealShade = data.seal == "none" ? 0 : data.sealHue[1]
				data.sealHue = data.seal == "none" ? "transparent" : data.sealHue[0]
				data.sealLayers = data.seal == "none" ? 0 : Math.floor(Math.random() * 2) + 1
				data.sealSize = data.seal == "none" ? 0 : Math.floor(Math.random() * 5) * 50 + 50
				data.sealRotation = data.seal == "none" ? 0 : chooseRandom(angles)
				data.sealPositions = data.seal == "none" ? [] : position

			// ring
				data.ring = Math.floor(Math.random() * 5) ? "none" : chooseRandom(Object.keys(symbols))
				data.ringHue = data.ring == "none" ? "transparent" : chooseRandom(hues)
				data.ringShade = data.ring == "none" ? 0 : data.ringHue[1]
				data.ringHue = data.ring == "none" ? "transparent" : data.ringHue[0]
				data.ringCount = data.ring == "none" ? 0 : Math.floor(Math.random() * 20) + 4
				data.ringSize = data.ring == "none" ? 0 : Math.floor(Math.random() * 3) * 50 + 50
				data.ringRadius = data.ring == "none" ? 0 : Math.floor(Math.random() * 2) * 50 + 100
				data.ringRotation = data.ring == "none" ? 0 : chooseRandom(angles)
				data.ringPositions = data.ring == "none" ? [] : position

			// emblems
				data.emblem = Math.floor(Math.random() * 4) ? "none" : chooseRandom(Object.keys(symbols))
				data.emblemHue = data.emblem == "none" ? "transparent" : chooseRandom(hues)
				data.emblemShade = data.emblem == "none" ? 0 : data.emblemHue[1]
				data.emblemHue = data.emblem == "none" ? "transparent" : data.emblemHue[0]
				data.emblemSize = data.emblem == "none" ? 0 : Math.floor(Math.random() * 4) * 50 + 50
				data.emblemRotation = data.emblem == "none" ? 0 : chooseRandom(angles)
				data.emblemPositions = data.emblem == "none" ? [] : position

			// next steps
				if ((data.structure == "solid" ||  data.secondaryHue == data.primaryHue || data.sectionCount == 1 || data.secondaryHue == "transparent")
				&& ((data.seal      == "none") || (data.sealHue      == data.primaryHue && data.sectionCount == 1))
				&& ((data.ring      == "none") || (data.ringHue      == data.primaryHue && data.sectionCount == 1))
				&& ((data.emblem    == "none") || (data.emblemHue    == data.primaryHue && data.sectionCount == 1))) {
					return randomizeData(data)
				}
				else {
					return data
				}
		}

/*** canvas ***/
	/* clearCanvas */
		function clearCanvas(canvas, context) {
			context.clearRect(0, 0, canvas.width, canvas.height)
		}

	/* rotateCanvas */
		function rotateCanvas(canvas, context, x, y, degrees, callback) {
			// rotate
				context.translate(x, y)
				context.rotate(degrees * Math.PI / 180)
				context.translate(-x, -y)

			// do whatever
				callback()

			// rotate back
				context.translate(x, y)
				context.rotate(-degrees * Math.PI / 180)
				context.translate(-x, -y)
		}

	/* drawLine */
		function drawLine(canvas, context, x1, y1, x2, y2, options) {
			// parameters
				options = options || {}
				context.beginPath()
				context.strokeStyle = options.gradient ? drawGradient(canvas, context, options) : (options.color || "transparent")
				context.lineWidth   = options.border || 1
				context.shadowBlur  = options.blur ? options.blur : 0
				context.shadowColor = options.shadow ? options.shadow : "transparent"
				context.globalAlpha = options.opacity || 1
				
			// draw
				context.moveTo(x1, canvas.height - y1)
				context.lineTo(x2, canvas.height - y2)
				context.stroke()
		}

	/* drawCircle */
		function drawCircle(canvas, context, x, y, radius, options) {
			// parameters
				options = options || {}
				context.beginPath()
				context.fillStyle   = options.gradient ? drawGradient(canvas, context, options) : (options.color || "transparent")
				context.strokeStyle = options.gradient ? drawGradient(canvas, context, options) : (options.color || "transparent")
				context.lineWidth   = options.border || 1
				context.shadowBlur  = options.blur ? options.blur : 0
				context.shadowColor = options.shadow ? options.shadow : "transparent"
				context.globalAlpha = options.opacity || 1

			// draw
				if (options.border) {
					context.arc(x, canvas.height - y, radius, (options.start || 0), (options.end || (2 * Math.PI)))
					context.stroke()
				}
				else {
					context.moveTo(x, canvas.height - y)
					context.arc(x, canvas.height - y, radius, (options.start || 0), (options.end || (2 * Math.PI)), true)
					context.closePath()
					context.fill()
				}
		}

	/* drawTriangle */
		function drawTriangle(canvas, context, x1, y1, x2, y2, x3, y3, options) {
			// parameters
				options = options || {}
				context.beginPath()
				context.fillStyle   = options.gradient ? drawGradient(canvas, context, options) : (options.color || "transparent")
				context.lineWidth   = options.border || 1
				context.shadowBlur  = options.blur ? options.blur : 0
				context.shadowColor = options.shadow ? options.shadow : "transparent"
				context.globalAlpha = options.opacity || 1

			// draw
				context.moveTo(x1, canvas.height - y1)
				context.lineTo(x2, canvas.height - y2)
				context.lineTo(x3, canvas.height - y3)
				context.lineTo(x1, canvas.height - y1)
				context.closePath()
				context.fill()
		}

	/* drawRectangle */
		function drawRectangle(canvas, context, x, y, width, height, options) {
			// parameters
				options = options || {}
				context.beginPath()
				context.fillStyle   = options.gradient ? drawGradient(canvas, context, options) : (options.color || "transparent")
				context.lineWidth   = options.border || 1
				context.shadowBlur  = options.blur ? options.blur : 0
				context.shadowColor = options.shadow ? options.shadow : "transparent"
				context.globalAlpha = options.opacity || 1

			// draw
				if (options.radii) {
					context.moveTo(x + options.radii.topLeft, canvas.height - y - height)
					context.lineTo(x + width - options.radii.topRight, canvas.height - y - height)
					context.quadraticCurveTo(x + width, canvas.height - y - height, x + width, canvas.height - y - height + options.radii.topRight)
					context.lineTo(x + width, canvas.height - y - options.radii.bottomRight)
					context.quadraticCurveTo(x + width, canvas.height - y, x + width - options.radii.bottomRight, canvas.height - y)
					context.lineTo(x + options.radii.bottomLeft, canvas.height - y)
					context.quadraticCurveTo(x, canvas.height - y, x, canvas.height - y - options.radii.bottomLeft)
					context.lineTo(x, canvas.height - y - height + options.radii.topLeft)
					context.quadraticCurveTo(x, canvas.height - y - height, x + options.radii.topLeft, canvas.height - y - height)
					context.closePath()
					context.fill()
				}
				else {
					context.fillRect(x, canvas.height - y, width, -1 * height)
				}
		}

	/* drawShape */
		function drawShape(canvas, context, x, y, width, height, options) {
			// parameters
				options = options || {}
				context.beginPath()
				context.fillStyle   = options.gradient ? drawGradient(canvas, context, options) : (options.color || "transparent")
				context.lineWidth   = options.border || 1
				context.shadowBlur  = options.blur ? options.blur : 0
				context.shadowColor = options.shadow ? options.shadow : "transparent"
				context.globalAlpha = options.opacity || 1

			// coordinates
				options.coordinates = options.coordinates.split(/\s?,\s?/)

			// draw
				for (var c in options.coordinates) {
					var pair = options.coordinates[c].split(/\s+/)
					
					if (!c) {
						context.moveTo(x + (width * Number(pair[0].replace("%", "")) / 100), (y + (height * Number(pair[1].replace("%", "")) / 100)))
					}
					else {
						context.lineTo(x + (width * Number(pair[0].replace("%", "")) / 100), (y + (height * Number(pair[1].replace("%", "")) / 100)))
					}
				}
				context.closePath()
				context.fill()
		}

	/* drawText */
		function drawText(canvas, context, x, y, text, options) {
			// variables
				options = options || {}
				context.font = (options.style ? options.style + " " : "") + (options.size || 32) + "px " + (options.font || font)
				context.fillStyle   = options.gradient ? drawGradient(canvas, context, options) : (options.color || "transparent")
				context.textAlign   = options.alignment || "center"
				context.shadowBlur  = options.blur ? options.blur : 0
				context.shadowColor = options.shadow ? options.shadow : "transparent"
				context.globalAlpha = options.opacity || 1


			// draw
				context.fillText((text || ""), x, canvas.height - y)
		}

	/* drawGradient */
		function drawGradient(canvas, context, options) {
			// radial
				if (options.gradient.r1 || options.gradient.r2) {
					var gradient = context.createRadialGradient(options.gradient.x1, options.gradient.y1, options.gradient.r1, options.gradient.x2, options.gradient.y2, options.gradient.r2)
				}

			// linear
				else {
					var gradient = context.createLinearGradient(options.gradient.x1, canvas.height - options.gradient.y1, options.gradient.x2, canvas.height - options.gradient.y2)
				}

			// colors
				var gradientColors = Object.keys(options.gradient.colors)
				for (var c in gradientColors) {
					gradient.addColorStop(Number(gradientColors[c]), options.gradient.colors[gradientColors[c]])
				}

			return gradient
		}

/*** flag ***/
	/* createFlag */
		function createFlag(canvas) {
			if (canvas.tagName.toLowerCase() == "canvas") {
				// data
					var context = canvas.getContext("2d")
					var data = randomizeData({})

				// field
					clearCanvas( canvas, context      )
					addField(    canvas, context, data)

				// structure
					addStructure(canvas, context, data)

				// seal
					addSeals(    canvas, context, data)

				// ring
					addRing(     canvas, context, data)

				// emblems
					addEmblems(  canvas, context, data)
			}
		}

	/* addField */
		function addField(canvas, context, data) {
			drawRectangle(canvas, context, 0, 0, canvas.width, canvas.height, {color: colors[data.fieldHue][data.fieldShade]})
		}

	/* addStructure */
		function addStructure(canvas, context, data) {
			// colors
				var structureColors = []
				if (data.primaryHue !== "transparent")     { structureColors.push(colors[data.primaryHue][data.primaryShade]) }
				if (data.secondaryHue !== "transparent")   { structureColors.push(colors[data.secondaryHue][data.secondaryShade]) }
				if (data.tertiaryHue !== "transparent")    { structureColors.push(colors[data.tertiaryHue][data.tertiaryShade]) }
				if (data.quarternaryHue !== "transparent") { structureColors.push(colors[data.quarternaryHue][data.quarternaryShade]) }
				if (data.quintaryHue !== "transparent")    { structureColors.push(colors[data.quintaryHue][data.quintaryShade]) }

				var i = 0
				while (structureColors.length < data.sectionCount + 7) {
					structureColors.push(structureColors[i])
					i++
				}

			// solid
				if (data.structure == "solid") {
					drawRectangle(canvas, context, 0, 0, canvas.width, canvas.height, {color: structureColors[0]})
				}

			// layers
				else if (data.structure == "rings") {
					rotateCanvas(canvas, context, canvas.width / 2, canvas.height / 2, data.sectionRotation, function() {
						for (var i = 0; i < data.sectionCount; i++) {
							drawCircle(canvas, context,
								canvas.width  / 2,
								canvas.height / 2,
								(canvas.height * ((data.sectionCount - i) / (data.sectionCount))) * (1 + data.sectionFactor / 10),
								{color: structureColors[i]})
						}
					})
				}

				else if (["square", "diamond", "x", "cross", "jack"].includes(data.structure)) {
					rotateCanvas(canvas, context, canvas.width / 2, canvas.height / 2, data.sectionRotation, function() {
						for (var i = 0; i < data.sectionCount; i++) {
							drawShape(canvas, context, 
								i / data.sectionCount * canvas.width  / 2 * (1 + data.sectionFactor / 10) - canvas.width  * (data.sectionFactor / 10) / 2,
								i / data.sectionCount * canvas.height / 2 * (1 + data.sectionFactor / 10) - canvas.height * (data.sectionFactor / 10) / 2,
								(canvas.width * ((data.sectionCount - i) / (data.sectionCount))) * (1 + data.sectionFactor / 10),
								(canvas.height * ((data.sectionCount - i) / (data.sectionCount))) * (1 + data.sectionFactor / 10),
								{coordinates: symbols[data.structure], color: structureColors[i]})
						}
					})
				}

			// checkers
				else if (data.structure == "checkers") {
					rotateCanvas(canvas, context, canvas.width / 2, canvas.height / 2, data.sectionRotation, function() {
						var checkerCount = data.sectionCount < 4 ? 1 : data.sectionCount < 9 ? 4 : data.sectionCount < 16 ? 9 : data.sectionCount < 25 ? 16 : data.sectionCount < 36 ? 25 : data.sectionCount < 49 ? 36 : 49
						var sideCount = Math.pow(checkerCount, 0.5)
						var width  = canvas.width  / sideCount
						var height = canvas.height / sideCount

						var i = 0
						for (var y = 0; y < sideCount; y++) {
							for (var x = 0; x < sideCount; x++) {
								drawRectangle(canvas, context, 
									width * x * (1 + data.sectionFactor / 10) - canvas.width  * (data.sectionFactor / 10) / 2,
									height * y * (1 + data.sectionFactor / 10) - canvas.height * (data.sectionFactor / 10) / 2,
									width  * (1 + data.sectionFactor / 10),
									height * (1 + data.sectionFactor / 10),
									{color: structureColors[i]})
								i++
							}

							if (checkerCount % 2 == 0) {
								i++
							}
						}
					})
				}

			// stripes
				else if (data.structure == "horizontal-stripes") {
					rotateCanvas(canvas, context, canvas.width / 2, canvas.height / 2, data.sectionRotation, function() {
						var i = 0
						var count = 0
						while (count < data.sectionCount) {
							drawRectangle(canvas, context, 
								-canvas.width,
								canvas.height - ((i + 1) * canvas.height / data.sectionCount) - canvas.height * (data.sectionFactor / 10) / data.sectionCount / 2,
								3 * canvas.width,
								canvas.height / data.sectionCount * (1 + data.sectionFactor / 10),
								{color: structureColors[i]})

							count++
							i = (count % 2 == 0) ? (count / 2) : data.sectionCount - ((count + 1) / 2)
						}
					})
				}

				else if (data.structure == "vertical-stripes") {
					rotateCanvas(canvas, context, canvas.width / 2, canvas.height / 2, data.sectionRotation, function() {
						var i = 0
						var count = 0
						while (count < data.sectionCount) {
							drawRectangle(canvas, context, 
								(i * canvas.width / data.sectionCount) - canvas.width * (data.sectionFactor / 10) / data.sectionCount / 2,
								-canvas.height,
								canvas.width / data.sectionCount * (1 + data.sectionFactor / 10),
								3 * canvas.height,
								{color: structureColors[i]})
							
							count++
							i = (count % 2 == 0) ? (count / 2) : data.sectionCount - ((count + 1) / 2)
						}
					})
				}

				else if (data.structure == "wedge-stripes") {
					rotateCanvas(canvas, context, canvas.width / 2, canvas.height / 2, data.sectionRotation, function() {
						for (var i = 0; i < data.sectionCount; i++) {
							drawCircle(canvas, context, 
								canvas.width  / 2,
								canvas.height / 2,
								canvas.width * (11 + data.sectionFactor) / 20,
								{color: structureColors[i], start: (i + 0.5) * 2 * Math.PI / data.sectionCount, end: (i - 0.5) * 2 * Math.PI / data.sectionCount})
						}
					})
				}
		}

	/* addSeals */
		function addSeals(canvas, context, data) {
			if (data.seal !== "none") {
				for (var i in data.sealPositions) {
					var x = Number(data.sealPositions[i].split(",")[0]) * (canvas.width  / 9) + (canvas.width  / 18)
					var y = Number(data.sealPositions[i].split(",")[1]) * (canvas.height / 9) + (canvas.height / 18)

					rotateCanvas(canvas, context, x, canvas.height - y, data.sealRotation, function() {
						for (var l = 1; l <= data.sealLayers; l++) {
							var color = (l % 2 == 0) ? colors[data.fieldHue][data.fieldShade] : colors[data.sealHue][data.sealShade]
							if (data.seal == "circle") {
								drawCircle(canvas, context, x, y, (data.sealSize / 2) * (5 - l) / 5, {color: color})
							}
							else if (data.seal == "ring") {
								drawCircle(canvas, context, x, y, (data.sealSize / 2) * (5 - l) / 5, {color: color, border: data.sealSize / 10})
							}
							else {
								drawShape(canvas, context, x - (data.sealSize / 2 * (5 - l) / 5), canvas.height - (y + (data.sealSize / 2 * (5 - l) / 5)), data.sealSize * (5 - l) / 5, data.sealSize * (5 - l) / 5, {color: color, coordinates: symbols[data.seal]})
							}
						}
					})
				}
			}
		}

	/* addRing */
		function addRing(canvas, context, data) {
			if (data.ring !== "none") {
				for (var i in data.ringPositions) {
					var x = Number(data.ringPositions[i].split(",")[0]) * (canvas.width  / 9) + (canvas.width  / 18)
					var y = Number(data.ringPositions[i].split(",")[1]) * (canvas.height / 9) + (canvas.height / 18)
					var color = colors[data.ringHue][data.ringShade]

					rotateCanvas(canvas, context, x, canvas.height - y, data.ringRotation, function() {
						for (var i = 1; i <= data.ringCount; i++) {
							var rotation = 360 / data.ringCount * i

								context.translate(-(data.ringRadius / 2), -(data.ringRadius / 2))
								rotateCanvas(canvas, context, x + (data.ringRadius / 2), canvas.height - y + (data.ringRadius / 2), rotation, function() {
									rotateCanvas(canvas, context, x, canvas.height - y, 360 / data.ringCount, function() {
										if (data.ring == "circle") {
											drawCircle(canvas, context, x, y, (data.ringSize / 2), {color: color})
										}
										else if (data.ring == "ring") {
											drawCircle(canvas, context, x, y, (data.ringSize / 2), {color: color, border: data.ringSize / 10})
										}
										else {
											drawShape(canvas, context, x - (data.ringSize / 2), canvas.height - (y + (data.ringSize / 2)), data.ringSize, data.ringSize, {color: color, coordinates: symbols[data.ring]})
										}
									})
								})
								context.translate((data.ringRadius / 2), (data.ringRadius / 2))
						}
					})
				}
			}
		}

	/* addEmblems */
		function addEmblems(canvas, context, data) {
			if (data.emblem !== "none") {
				for (var i in data.emblemPositions) {
					var x = Number(data.emblemPositions[i].split(",")[0]) * (canvas.width  / 9) + (canvas.width  / 18)
					var y = Number(data.emblemPositions[i].split(",")[1]) * (canvas.height / 9) + (canvas.height / 18)
					var color = colors[data.emblemHue][data.emblemShade]

					rotateCanvas(canvas, context, x, canvas.height - y, data.emblemRotation, function() {
						if (data.emblem == "circle") {
							drawCircle(canvas, context, x, y, (data.emblemSize / 2), {color: color})
						}
						else if (data.emblem == "ring") {
							drawCircle(canvas, context, x, y, (data.emblemSize / 2), {color: color, border: data.emblemSize / 10})
						}
						else {
							drawShape(canvas, context, x - (data.emblemSize / 2), canvas.height - (y + (data.emblemSize / 2)), data.emblemSize, data.emblemSize, {color: color, coordinates: symbols[data.emblem]})
						}
					})
				}
			}
		}
