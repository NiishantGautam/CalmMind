import { ImageSourcePropType } from "react-native";

interface Session {
    id: number;
    title: string;
    description: string;
    event: string;
    image: ImageSourcePropType | undefined;
}

export const sessions: Session[] = [
    {
        id: 1,
        title: "Guts' Struggle - Inner Strength",
        description: "Channel the determination of Guts in his darkest moments. This meditation focuses on finding inner strength during overwhelming challenges, teaching you to persevere through life's most difficult battles with unwavering resolve.",
        event: "About perseverance and inner strength",
        image: require("@/assets/berserk1-1.jpg"),
    },
    {
        id: 2,
        title: "Black Swordsman's Focus",
        description: "Develop laser-sharp concentration like Guts wielding the Dragon Slayer. This session helps you cut through mental clutter and distractions, achieving a state of pure focus and clarity in your daily pursuits.",
        event: "About concentration and clarity",
        image: require("@/assets/berserk16.jpg"),
    },
    {
        id: 3,
        title: "Band of the Hawk Brotherhood",
        description: "Explore the power of meaningful connections and loyalty. Based on the bonds formed within the Band of the Hawk, this meditation cultivates deep appreciation for friendship, trust, and the strength found in genuine relationships.",
        event: "About relationships and loyalty",
        image: require("@/assets/berserk118.jpg"),
    },
    {
        id: 4,
        title: "Casca's Resilience",
        description: "Learn to heal from trauma and rebuild your sense of self. This gentle yet powerful session focuses on recovery, self-compassion, and finding hope even after experiencing profound hurt or loss.",
        event: "About healing and recovery",
        image: require("@/assets/berserk158.jpg"),
    },
    {
        id: 5,
        title: "Eclipse Transformation",
        description: "Navigate through life's most challenging transformations. This meditation helps you process major life changes, betrayals, or setbacks, teaching you to emerge stronger and wiser from your darkest hours.",
        event: "About navigating major life changes",
        image: require("@/assets/berserk183.jpg"),
    },
    {
        id: 6,
        title: "Berserker's Peace",
        description: "Find calm within the storm of intense emotions. Learn to harness your passionate nature and channel intense feelings into constructive action, achieving balance between fierce determination and inner tranquility.",
        event: "About emotional balance and channeling intensity",
        image: require("@/assets/berserk215.jpg"),
    } 

]