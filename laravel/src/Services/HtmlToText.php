<?php

namespace Peppermint\MailBuilder\Services;

/**
 * Erzeugt den Textteil einer Mail aus ihrem HTML.
 *
 * Jede Mail sollte zusaetzlich als reiner Text mitgeschickt werden
 * (`multipart/alternative`): Spamfilter bewerten eine Mail ohne Textteil als
 * schwaches Signal, und manche Programme zeigen ohnehin nur den Text.
 *
 * Das Ergebnis ist bewusst schlicht. Ziel ist nicht, das Layout in ASCII
 * nachzubauen, sondern den Inhalt lesbar zu erhalten — mit Absatzgrenzen und
 * ohne die Leerraumwueste, die ein Tabellenlayout sonst hinterlaesst.
 */
class HtmlToText
{
    public function convert(string $html): string
    {
        // Kopfbereich, Stile und Skripte tragen keinen lesbaren Inhalt. Sie
        // muessen zuerst weg, sonst landen CSS-Regeln mitten im Text.
        $text = preg_replace('~<(head|style|script)\b[^>]*>.*?</\1>~is', '', $html) ?? $html;

        // Versteckte Vorschauzeile: sie ist fuer die Nachrichtenliste gedacht
        // und wuerde im Textteil als doppelter erster Satz erscheinen.
        $text = preg_replace('~<div\b[^>]*(?:display\s*:\s*none|max-height\s*:\s*0)[^>]*>.*?</div>~is', '', $text) ?? $text;

        // Links als „Beschriftung (Ziel)", damit die Adresse nicht verloren
        // geht — im Text ist ein Verweis ohne sein Ziel wertlos.
        $text = preg_replace('~<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>~is', '$2 ($1)', $text) ?? $text;

        // Blockgrenzen in Zeilenumbrueche uebersetzen, bevor die Tags fallen.
        $text = preg_replace('~<(br|/p|/div|/tr|/h[1-6]|/li)\b[^>]*>~i', "\n", $text) ?? $text;

        $text = html_entity_decode(strip_tags($text), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        // Tabellenlayouts erzeugen viel Leerraum; auf hoechstens eine
        // Leerzeile eindampfen.
        $text = preg_replace('~[ \t]+~', ' ', $text) ?? $text;
        $text = preg_replace('~ ?\n ?~', "\n", $text) ?? $text;
        $text = preg_replace('~\n{3,}~', "\n\n", $text) ?? $text;

        return trim($text);
    }
}
