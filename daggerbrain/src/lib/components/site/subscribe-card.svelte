<script>
	import { goto } from "$app/navigation";
	import ArrowRight from "@lucide/svelte/icons/arrow-right";
	import { cn } from "tailwind-variants";
	import { buttonVariants } from "../ui/button";

</script>


            <button
                class="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-muted-foreground/20 bg-background/70 text-left shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl sm:mx-0"
                onclick={() => {
                    goto('/subscribe');
                }}
            >
                <img
                    src="/images/art/ocean-ravens.webp"
                    alt=""
                    class="absolute inset-0 h-full w-full object-cover opacity-15 transition-all duration-600 group-hover:scale-103 group-hover:opacity-25"
                />
                <!-- Top linear gradient -->
                <div
                    class="hero-gradient-top pointer-events-none absolute top-0 right-0 left-0 rounded-t-xl"
                ></div>
                <!-- Bottom linear gradient -->
                <div
                    class="hero-gradient-bottom pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-xl"
                ></div>
                <!-- Content -->
                <div class="z-20 flex grow flex-col gap-10 px-8 pt-14 pb-10">
                    <h2
                        class="relative text-center font-eveleth text-2xl font-bold opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    >
                        Become an Adventurer
                    </h2>
                    <p class="relative grow text-center text-sm">
                        Subscribe to unlock <b class="text-accent">unlimited characters</b> and support the
                        development of Daggerbrain
                    </p>
                    <div
                        class={cn(
                            buttonVariants(),
                            'border border-muted/20 bg-accent/50 shadow-lg hover:bg-accent/50'
                        )}
                    >
                        Subscribe
                        <ArrowRight
                            class="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </div>
                </div>
            </button>
       